/* eslint-disable jsx-a11y/href-no-hash */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import MSearch from '../../components/PSearch';
import styles from './index.less';
import { useAsync } from 'react-use';
import { getGoodDetail, addComment } from '../../services/goods';
import { Button, Divider, Empty, Input, Spin, Tag, Modal, message } from 'antd';
import { tags } from '../../utils/util';
import dayjs from 'dayjs';

// import { UserOutlined, AccountBookOutlined } from '@ant-design/icons';

function GoodsCenter(props) {
  const { match } = props;
  const [key, useKey] = useState('');
  const [text, setText] = useState('');
  const [selectImg, setSelectImg] = useState(0);
  const [commentVisiable, setCommentVisiable] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const res = useAsync(async () => {
    const { params } = match;
    const result = await getGoodDetail(params.goodId);
    return result.data;
  }, [refreshKey]);

  const onChangeKey = (currentKey) => {
    useKey(currentKey);
  }

  const onSearchGoods = () => {
    const { history } = props;
    history.push(`/app/goodscenter?searchkey=${key}`);
  }
  
  const onChangeImg = (no) => {
    setSelectImg(no);
  }

  const onaddComment = async () => {
    const { params } = match;
    const result = await addComment(text, params.goodId, props.auth.user.user_id);
    if (result && result.data.success) {
      message.success('留言成功');
      setCommentVisiable(false);
      setRefreshKey(refreshKey + 1);
    } else {
      message.error('留言失败');
    }
  }

  const onChangeText = (e) => {
    setText(e.target.value.slice(0, 100));
  }

  const handleclickAddComment = () => {
    if (props.auth.user != {}) {
      setCommentVisiable(true);
    } else {
      message.warn('请先登录');
    }
  }
  
  const getConnect = () => {
    console.log('点击了联系对方');
  }

  const gotoBuy = () => {
    const { user } = props.auth;
    if (Object.keys(user).length === 0) {
      message.warn('你还未登录，请先登录');
      props.history.push("/app/login");
    } else {
      props.history.push('/app/order?goodId=' + res.value.data.good_id);
    }
  }
  return (
    <div>
      <div style={{ marginTop: '20px' }}>
        <MSearch
          keyword={key}
          onChange={onChangeKey}
          onMyClick={onSearchGoods}
        />
      </div>
      <Spin
        spinning={res.loading}
      >
        {
          (res.value && res.value.success) ? (
            <div className={styles.center}>
              <div className={styles.good_detail}>
                <div className={styles.left}>
                  <div className={styles.img_room} style={{ backgroundImage: `url(${res.value.data.imgs[selectImg].good_img_src})` }}>
                  </div>
                  {
                    res.value.data.imgs.map((item, index) => {
                      // eslint-disable-next-line jsx-a11y/alt-text
                      return (<img src={item.good_img_src} className={`${styles.smallImg} ${selectImg === index ? styles.activeImg : ''}`} onClick={onChangeImg.bind(this, index)}/>)
                    })
                  }
                </div>
                <div className={styles.right}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600' }}>{res.value.data.good_name}</h2>
                  <span>{res.value.data.good_produce}</span>
                  <div style={{ fontSize: '16px', marginTop: '15px' }}>
                    {/* <UserOutlined style={{ marginRight: '10px' }}/> */}
                    <span style={{ fontSize: '14px' }}>卖家：</span>
                    {res.value.data.user_nick}
                  </div>
                  <div style={{ marginTop: '15px' }}>
                    成色：
                    <Tag color="#f50">{tags[res.value.data.good_condition]}</Tag>
                  </div>
                  <div style={{ marginTop: '15px' }}>
                    位置：
                    {res.value.data.school_name}
                  </div>
                  <div style={{ marginTop: '15px' }}>
                    发布时间：
                    {dayjs.unix(res.value.data.good_create_time).format('YYYY-MM-DD')}
                  </div>
                  <div style={{ marginTop: '15px' }}>
                      运费：
                      { res.value.data.good_transportation_price == 0 ? '包邮' : `￥${res.value.data.good_transportation_price}`}
                  </div>
                  <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '20px', color: 'red' }}>
                      {/* <AccountBookOutlined style={{ marginRight: '10px' }}/> */}
                      <span style={{ fontSize: '14px', color: '#000' }}>出售价格：</span>
                      ￥{res.value.data.good_out_price}
                    </div>
                    <div>
                      入手价格：
                      ￥{res.value.data.good_in_price}
                    </div>
                  </div>
                  <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      type="default"
                      size="small"
                      onClick={getConnect}
                    >
                      联系卖家
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      onClick={gotoBuy}
                    >
                      立即购买
                    </Button>
                  </div>
                </div>
              </div>
              <div className={styles.user_board}>
                  <div className={styles.title}>
                    <h3>全部留言</h3>
                    <Button type="primary" size="small" onClick={handleclickAddComment}>发布留言</Button>
                  </div>
                  <Divider></Divider>
                  {
                    res.value.data.comments ? (
                      res.value.data.comments.map((item, index) => {
                        return (
                          <div className={styles.commentsItem} key={Math.random() * 1000 + index}>
                            <h3>{item.user_nick}</h3>
                            <div>{item.comment_content}</div>
                            <div style={{ color: '#808695' }}>{dayjs.unix(item.comment_create_time).format('YYYY-MM-DD')}</div>
                            {
                              (index === (res.value.data.comments.length - 1)) ? null : <Divider></Divider>
                            }
                          </div>
                        );
                      })
                    ) : <Empty></Empty>
                  }
              </div>   
            </div>
          ) : <Empty></Empty>
        }
      </Spin>
      {
        commentVisiable && (
          <Modal
              visible={commentVisiable}
              onCancel={() => setCommentVisiable(false)}
              onOk={onaddComment}
              title="添加留言"
            >
              <Input.TextArea
                showCount
                maxLength={100}
                onChange={onChangeText}
                value={text}
              />
          </Modal>
        )
      }
    </div>
  );
}

const GoodMapsState = (state) => {
  return {
    auth: state.auth,
  }
}

export default connect(GoodMapsState)(GoodsCenter);
