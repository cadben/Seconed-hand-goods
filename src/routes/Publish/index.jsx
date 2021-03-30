import React from 'react';
import { connect } from 'dva';
import MHeader from '@/components/PSearch';
import { Divider, Tabs, Upload, Form, Input, Select, Radio, InputNumber, Button, Collapse, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from './index.less';
import OSS from 'ali-oss';
import { v4 as uuidv4 } from 'uuid';
import { getOSSSTS, getBaiduVerift, getGoodPrice } from '../../services/oss';

const { TabPane } = Tabs;
const { Option } = Select;
class PublishPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      fileList: [],
      classes: [],
      jd_price: 0,
    }
  }

  PublishForm = React.createRef();

  onChangeKey = (currentKey) => {
    this.setState({
      key: currentKey,
    });
  }

  onSearchGoods = (key) => {
    const { history } = this.props;
    history.push(`/app/goodscenter?searchkey=${key}`);
  }

  beforeAddLogo = (file) => {
    const { size } = file;
    if ((size / 1024 / 1024) < 1) {
      const { auth } = this.props;
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const img = document.createElement('img');
          img.src = reader.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            ctx.fillStyle = '#fff';
            ctx.textBaseline = 'middle';
            console.log(canvas.width);
            ctx.font = (Number(canvas.width / 100) + 12) + 'px Arial';
            ctx.fillText(`在线二货交易@${auth.user.user_name}`, 20, 20);
            canvas.toBlob(resolve);
          };
        };
      });
    } else {
      message.error('图片大小不能超过1MB');
      return false;
    }
  }
  updateAssetsImg = async (file) => {
    const uid = uuidv4();
    const OSSData = await getOSSSTS();
    const client = new OSS({
      region: OSSData.data.region,
      accessKeyId: OSSData.data.accessKeyId,
      accessKeySecret: OSSData.data.accessKeySecret,
      stsToken: OSSData.data.stsToken,
      bucket: OSSData.data.bucket,
      endpoint: OSSData.data.endpoint,
    });
    const path = `/seconed-hands-assets/${uid}.${file.type.replace('image/', '')}`;
    const newFile = {
      status: 'pending',
      goodImg: `http://domy-ckf.oss-cn-hangzhou.aliyuncs.com${path}`,
    }
    let files = this.state.fileList;
    files.push(newFile);
    this.setState({
      fileList: files,
    });
    const UpdateResult = await client.multipartUpload(path, file, {
      progress: (p) => {
        if (p === 1) {
        }
      },
    });
    const newLists = this.state.fileList;
    if (UpdateResult && UpdateResult.res) {
      const fileUrl = UpdateResult.res.requestUrls[0].split('?')[0];
      newLists.forEach((item) => {
        if (item.goodImg === fileUrl) {
          item.status = 'success';
        }
      });
      const verifyResult = await getBaiduVerift(fileUrl);
      let arrSet = verifyResult.data.result.map((item) => {
        return item.keyword;
      });
      arrSet = arrSet.filter((item) => {
        return !item.includes('广告') && !item.includes('截图');
      });
      arrSet.push('其他');
      this.setState({
        classes: Array.from(new Set(this.state.classes.concat(arrSet))),
      })
    };
    await this.setState({
      fileList: [...newLists],
    });
    return true;
  }

  handleChangeName = (e) => {
    const key = e.target.value;
    if (key === '') {
      this.setState({ jd_price: 0 });
      return ;
    }
    new Promise((resolve, reject) => {
      getGoodPrice(key).then((res) => {
        if (res) {
          resolve(res);
        }
      });
    }).then((res) => {
      if (res.data) {
        const data = res.data;
        const { p } = data[0];
        console.log(data);
        this.setState({ jd_price: p });
      }
    })
  }

  onFinishLogin = () => {
    const { getFieldsValue } = this.PublishForm.current;
    console.log(getFieldsValue('goods_form'));
  }

  render() {
    const { fileList } = this.state;
    return (
      <div className={styles.publishPage}>
          <MHeader
            keyword={this.state.key}
            onChange={this.onChangeKey}
            onMyClick={this.onSearchGoods}
          />
          <Divider/>
          <Tabs type="card">
            <TabPane tab="发布商品" key="1">
              <div className={styles.publishContent}>
                <Form
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 16 }}
                  ref={this.PublishForm}
                  name="goods_form"
                  onFinish={this.onFinishLogin}
                >
                  <Form.Item
                    label="上传图片"
                  >
                    {
                      fileList && (
                        fileList.map((item, index) => {
                          console.log(item);
                          return (
                            <div key={index} style={item.status === 'success' ? { backgroundImage: `url(${item.goodImg})` } : { backgroundColor: '#000' }} className={styles.goodImg}>
                              {
                                !(item.status === 'success') && (
                                  <LoadingOutlined className={styles.loadingIcon}/>
                                )
                              }
                            </div>
                          )
                        })
                      )
                    }
                    {
                      (fileList.length < 8) && (<Upload
                        beforeUpload={this.beforeAddLogo}
                        showUploadList={false}
                        accept="image/*"
                        customRequest={
                          async (options) => {
                            const { file } = options;
                            const result = await this.updateAssetsImg(file);
                            if (result) {
                              options.onSuccess({ success: true }, options.file);
                            }
                             else {
                              options.onError(new Error('上传失败'));
                            }
                          }
                        }
                      >
                        <div className={styles.upBt}>
                          <PlusOutlined style={{ marginTop: "20px" }}/>
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      </Upload>)
                    }
                  </Form.Item>
                  <Form.Item
                    label="商品名称"
                    name="good_name"
                    rules={[{ required: true, message: '名称不能为空' }]}
                  >
                    <Input
                      placeholder="请输入名称"
                      onBlur={this.handleChangeName}
                    />
                  </Form.Item>
                  <Form.Item
                    label="分类"
                    name="good_classify"
                  >
                    <Select style={{ width: '200px' }} >
                      {
                        this.state.classes.map((item, index) => {
                          return (
                            <Option key={index} value={item}>{item}</Option>
                          )
                        })
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="品牌"
                    name="good_brand"
                  >
                    <Input placeholder="请输入商品品牌" style={{ width: '200px' }}/>
                  </Form.Item>
                  <Form.Item
                    label="成色"
                    name="good_quality"
                  >
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value="a">全新</Radio.Button>
                      <Radio.Button value="b">几乎全新</Radio.Button>
                      <Radio.Button value="c">轻微使用痕迹</Radio.Button>
                      <Radio.Button value="d">明显刮擦痕迹</Radio.Button>
                      <Radio.Button value="e">严重损坏</Radio.Button>
                      <Radio.Button value="f">其他</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    label="出售价格"
                    name="good_price"
                  >
                    <div
                      style={{ fontSize: '16px' }}
                    >
                      <InputNumber min={0} max={9999999} step={1} style={{ marginLeft: '5px', marginRight: '5px' }}/> 元 {
                        (this.state.jd_price > 0) && (<span>京东价格 ¥{this.state.jd_price}</span>)
                      }
                    </div>
                  </Form.Item>
                  <Form.Item
                    label="入手价格"
                    name="good_price_in"
                  >
                    <div
                      style={{ fontSize: '16px' }}
                    >
                      <InputNumber min={0} max={9999999} step={1} style={{ marginLeft: '5px', marginRight: '5px' }}/> 元
                    </div>
                  </Form.Item>
                  <Form.Item
                    label="邮费"
                    name="good_price_out"
                  >
                    <div
                      style={{ fontSize: '16px' }}
                    >
                      <Input defaultValue="商议" style={{ marginLeft: '5px', marginRight: '5px' }}/>
                    </div>
                  </Form.Item>
                  <Form.Item
                    label="商品描述"
                    name="good_descript"
                  >
                    <Input.TextArea rows={4}/>
                  </Form.Item>
                  <Form.Item
                    label="操作"
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: '150px' }}
                    >发布</Button>
                  </Form.Item>
                </Form>
                <Collapse defaultActiveKey={['1']} accordion style={{ fontSize: '14px' }}>
                  <Collapse.Panel header="上传图片" key="1">
                    <h4>1.多角度，尽量全面的照片</h4>
                    正面、反面、侧面、45度…多幅实拍照片，能有效提高买家对商品成色的认知度，避免纠纷;
                    如有瑕疵或磨损，尽量拍张特写哦~记得选一张商品最靓的照片作为主图呢。
                    <h4>2.图片限制</h4>
                    图片每张最大1M，最多8张，我们会保证您上传图片的质量，为买家展示最真实的商品信息哦。
                  </Collapse.Panel>
                  <Collapse.Panel header="完善基本信息" key="2">
                    <h4>1.匹配的类目</h4>
                    选择精准的类目、品牌、型号，可使买家更准确的找到您的商品；
                    <h4>2.简洁的标题</h4>
                    吸引人的标题是增加商品点击率的关键~标题尽量简明扼要，准确的描述出部分信息，使买家一目了然。
                    <h4>3.准确的成色</h4>
                    您可选择商品所对应的成色~
                    <h4>4.合理的定价</h4>
                    您选定型号后价格右侧会提示新品参考价；您也可搜索该商品，参考其他卖家的商品，合理定价。
                  </Collapse.Panel>
                  <Collapse.Panel header="详细描述" key="3">
                    <h4>1.商品情况</h4>
                    您可以简单介绍商品入手时间、使用方式/频度、商品的现状，商品的附件情况最好以枚举形式说明，避免买家反复询问；另外商品的拆修史，功能、外观上的瑕疵记得补充说明哦~
                    <h4>2.其他信息</h4>
                    如您有其他涉及交易的信息，比如不拆卖、仅单出、打包优惠等，请加以说明，以便买家更好的了解您可接受的交易方式。
                  </Collapse.Panel>
                </Collapse>
              </div>
            </TabPane>
          </Tabs>
      </div>
    );
  }
}

const mapProps = (state) => {
  return {
    auth: state.auth,
  }
}

export default connect(mapProps)(PublishPage);
