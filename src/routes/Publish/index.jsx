import React from 'react';
import { connect } from 'dva';
import MHeader from '@/components/PSearch';
import { Divider, Tabs, Upload, Form, Input, Select } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from './index.less';
import OSS from 'ali-oss';
import { v4 as uuidv4 } from 'uuid';
import { getOSSSTS, getBaiduVerift } from '../../services/oss';

const { TabPane } = Tabs;
const { Option } = Select;
class PublishPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      fileList: [],
      classes: [],
    }
  }

  // PublishForm = React.createRef();

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
          ctx.font = '28px Arial';
          ctx.fillText(`在线二货交易@${auth.user.name}`, 20, 20);
          canvas.toBlob(resolve);
        };
      };
    });
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
      this.setState({
        classes: verifyResult.data.result,
      })
    };
    await this.setState({
      fileList: [...newLists],
    });
    return true;
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
                  // ref={this.PublishForm}
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
                    label="标题"
                    rules={[{ required: true, message: '标题不能为空' }]}
                  >
                    <Input 
                      placeholder="请输入标题"
                    />
                  </Form.Item>
                  <Form.Item
                    label="分类"
                  >
                    <Select style={{ width: '200px' }} >
                      {
                        this.state.classes.map((item, index) => {
                          return (
                            <Option key={index} value={item.keyword}>{item.keyword}</Option>
                          )
                        })
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="成色"
                  >

                  </Form.Item>
                </Form>
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
