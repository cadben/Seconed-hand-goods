/* eslint-disable jsx-a11y/href-no-hash */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import MSearch from '../../components/PSearch';
import styles from './index.less';
import { Button, Empty, Input, message, Tag, Divider } from 'antd';
import { LoginOut, verify, getLogin, getAddress, addAddress, deleteAddress } from '../../services/auth';
import GoodsItem from '../../components/GoodsItem/index';
import { Tabs, Modal } from 'antd';
import request from '../../utils/request';
import SchoolSearch from '../../components/SchoolSearch';
import dayjs from 'dayjs';
import { status as OrderStatus } from '../../utils/util';
import { UserOutlined } from '@ant-design/icons';
import socket from 'socket.io-client';
// import { UserOutlined, AccountBookOutlined } from '@ant-design/icons';

function My(props) {

  const { auth } = props;
  const { user } = auth;
  useEffect(() => {
    if (Object.keys(user).length === 0) {
      const result = getLogin();
      result.then(res => {
        if (res && res.data && res?.data?.success) {
          props.dispatch({
            type: 'auth/saveAuth',
            payload: {
              user: res.data.data,
            }
          });
        } else {
          message.warn('请先登录');
          props.history.push('/app/login');
        }
      });
    }
  }, []);

  const url = new URL(window.location.href);
  const status = url.searchParams.get('status');
  const receive = url.searchParams.get('receive');
  const [key, useKey] = useState('');
  const [tabsKey, setTabsKey] = useState(!status ? '1' : status == '1' ? '2' : '3');
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [ifgetcode, setifgetcode] = useState(false);
  const [time, setTime] = useState(60);
  const [verifyVisiable, setVerifyVisiable] = useState(false);
  const [school, setSchool] = useState('');
  const [Address, setAddress] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [addAddressVisible, setAddressVisible] = useState(false);
  const [getname, setGetName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setaddress] = useState('');
  const [myGoods, setMyGoods] = useState([]);
  const [chatText, setChatText] = useState('');
  const [Client, setClient] = useState(null);
  const [receiver, setReceiver] = useState(receive);
  const [chatContentList, setChatContentList] = useState([]);
  const [selectRec, setSelectRec] = useState(0);
  const [userList, setUserList] = useState([]); 
  const [allChat, setAllChat] = useState(null);

  useEffect(() => {
    const res = fetch('/nodeapi/getchat?user=' + user.user_id);
    console.log(res);
  }, []);

  const getAddressFunc = async () => {
    if (Object.keys(user).length === 0) {
      const result = getLogin();
      result.then(async res => {
        if (res && res.data && res?.data?.success) {
          const result2 = await getAddress({ userId: res.data.data.user_id });
          setAddress(result2.data);
          const result3 = await request('/nodeapi/getallorder?userId=' + res.data.data.user_id);
          setOrderList(result3);
          const result4 = await request('/nodeapi/getowngoods?userId=' + res.data.data.user_id);
          setMyGoods(result4);
          const result5 = await request('/nodeapi/getchatperson?user=' + res.data.data.user_id );
          setUserList(result5.data);
        }
      });
    } else {
      const result2 = await getAddress({ userId: user.user_id });
      setAddress(result2.data);
      const result3 = await request('/nodeapi/getallorder?userId=' + user.user_id);
      setOrderList(result3.data);
    }
  }

  useEffect(() => {
    getAddressFunc();
  }, []);

  const onChangeKey = (currentKey) => {
    useKey(currentKey);
  }

  const onSearchGoods = () => {
    const { history } = props;
    history.push(`/app/goodscenter?searchkey=${key}`);
  }

  const changeTabs = (e) => {
    setTabsKey(e);
  }

  const handleLoginout = async () => {
    const res = await LoginOut();
    if (res.data.success) {
      message.success('退出登录成功');
      props.history.push('/app');
    }
  }

  const onVerify = async () => {
    if (!school) {
      message.warn('请输入学校');
    }
    else if (!name) {
      message.warn('请输入姓名');
    }
    else if (!text) {
      message.warn('请输入邮箱');
    }
    else if (!code) {
      message.warn('请输入邮箱验证码');
    }
    else {
      const result = await verify({
        name,
        userId: user.user_id,
        email: text + '.edu.cn',
        inputcode: code,
        school,
      });
      if (result && result.data.success) {
        message.success('验证成功');
        props.history.push('/app/my');
      } else {
        message.error(result.data.msg);
      }
    }
  }

  const gotoVerify = (e) => {
    e.preventDefault();
    setVerifyVisiable(true);
  }

  const changeSchool = (e) => {
    setSchool(e);
  }

  const handleAddAddress = async () => {
    if (!getname) {
      message.warn('请输入收货人姓名');
    }
    else if (!phone) {
      message.warn('请输入手机号');
    }
    else if (!address) {
      message.warn('请输入详细地址');
    }
    else {
      const result = await addAddress({
        userid: user.user_id,
        phone,
        name: getname,
        address
      });
      if (result && result.data.success) {
        setAddressVisible(false);
        getAddressFunc();
        setGetName('');
        setPhone('');
        setaddress('');
        message.success('添加成功');
      } else {
        message.error('添加失败');
      }
    }
  }

  const handleDeleteOrder = async (id) => {
    const res = await request('/nodeapi/deleteorder', {
      method: 'post',
      body: JSON.stringify({
        id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res && res.data.success) {
      message.success('删除成功');
      const List = orderList.data.data.filter((item) => {
        return item.good_order_id != id;
      });
      const oldOrderList = JSON.parse(JSON.stringify(orderList));
      oldOrderList.data.data = List;
      setOrderList(oldOrderList);
    } else {
      message.error('删除失败');
    }
  }

  const handleOKOrder = async (id) => {
    const res = await request('/nodeapi/okorder', {
      method: 'post',
      body: JSON.stringify({
        id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res && res.data.success) {
      message.success('修改成功');
      const oldOrderList = JSON.parse(JSON.stringify(orderList));
      oldOrderList.data.data.forEach((item) => {
        if (item.good_order_id == id) {
          item.order_status = 2;
        }
      });
      setOrderList(oldOrderList);
    } else {
      message.error('修改失败');
    }
  }

  useEffect(() => {
    const client = socket('ws://localhost:3000', {
      transports: ['websocket']
    });
    client.on("connect", function () {
      // console.log(socket.broadcast)
      let arr = [];
      client.on('sendOtherText', (msg) => {
        if (msg) {
          console.log(msg);
          const data = JSON.parse(msg);
          arr.push(data);
          setChatContentList([...arr]);
        }
      })
    });
    setClient(client);
  }, []);

  const handleSendMsg = async () => {
    if (!chatText) {
      message.error('请不要发送空信息');
      return;
    }
    if (!chatContentList[receiver]) {
      chatContentList[receiver] = [];
    }
    Client.emit('sendtext', JSON.stringify({ msg_create: dayjs().unix(), user: user.user_id, msg: chatText, reciveUser: receiver }));
    setChatText('');
  }

  console.log('123', chatContentList);

  return (
    <div>
      <div style={{ marginTop: '20px' }}>
        <MSearch
          keyword={key}
          onChange={onChangeKey}
          onMyClick={onSearchGoods}
        />
      </div>
      <Tabs defaultActiveKey={tabsKey} onChange={changeTabs} type="card">
        <Tabs.TabPane tab="个人中心" key="1">
          <div className={styles.authContent}>
            <div style={{ display: 'flex', alignItems: 'center' }}>昵称：<h3 style={{ fontWeight: '600', marginBottom: '0px' }}>{user.user_nick}</h3></div>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span>学生身份认证：{user.user_verify ? (<span>已认证</span>) : (<a style={{ color: '#8f8f8f' }} onClick={gotoVerify}>去认证</a>)}</span>
              {
                user.user_verify ? <span>真实姓名：{user.user_name}</span> : null
              }
              {
                user.user_verify ? <span>邮箱：{user.user_email}</span> : null
              }
            </div>
            <div style={{ marginTop: '10px' }}>手机号：{user.user_phone ? user.user_phone : '未认证'}</div>
            {user.school_name && <div style={{ marginTop: '10px' }}>学校：{user.school_name}</div>}
          </div>
          <div className={styles.orderContent}>
            <h3>我买到的</h3>
            <div className={styles.orderContentHeader}>
              <span style={{ flex: '3' }}>商品名称</span>
              <span>单价（元）</span>
              <span>数量</span>
              <span>实付金额（元）</span>
              <span>订单状态</span>
              <span>订单操作</span>
            </div>
            {
              orderList.data && orderList.data.data && orderList.data.data.map((item, index) => {
                return (
                  <div className={styles.orderItem}>
                    <div className={styles.orderItemHeader}>
                      <span style={{ color: '#999999' }}>订单时间：{dayjs.unix(item.order_create_time).format('YYYY-MM-DD')}</span>
                      <span>订单编号：{item.good_order_id}</span>
                      <span>卖家：{item.good_nick_name}</span>
                    </div>
                    <div>
                      <div className={styles.orderContent2}>
                        <div className={styles.good_detail}>
                          <img
                            alt=""
                            src={item.img}
                          />
                          <div className={styles.detail}>
                            <div>{item.good_name}</div>
                            <div style={{ color: 'grey' }}>{item.good_category}</div>
                          </div>
                        </div>
                        <div className={styles.generateItem}>￥{item.good_out_price?.toFixed(2)}</div>
                        <div className={styles.generateItem}>1</div>
                        <div className={styles.generateItem}>￥{item.good_out_price?.toFixed(2)}</div>
                        <div className={styles.generateItem}>
                          <Tag color="#eb9a4e">{OrderStatus[Number(item.order_status)]}</Tag>
                          <a onClick={(e) => { e.preventDefault(); window.location.href = '/app/order/detail?orderId=' + item.good_order_id }}>查看订单</a>
                        </div>
                        <div className={styles.generateItem}>
                          <Button onClick={handleOKOrder.bind(this, item.good_order_id)} size="small" style={{ fontSize: '12px', color: '#fff', background: '#FF661A' }}>确认收货</Button>
                          <Button onClick={handleDeleteOrder.bind(this, item.good_order_id)} size="small" style={{ fontSize: '12px', color: '#000', marginTop: '5px' }}>删除订单</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className={styles.orderGoods}>
            <h3>我卖出的</h3>
            <div className={styles.orderGoodList}>
              {
                myGoods && myGoods.data && myGoods.data.data.map((item, index) => {
                  return (
                    <div style={{ position: 'relative' }}>
                      <GoodsItem ItemData={item} key={Math.random() * 10000} gotoDetail={() => { window.location.href = '/app/good/' + item.good_id }}></GoodsItem>
                      <Button
                        style={{ position: 'absolute', top: '10px', left: '10px' }}
                        type="primary" size="small" onClick={
                          async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const res = await request('/nodeapi/deletegood', {
                              method: 'post',
                              body: JSON.stringify({
                                id: item.good_id,
                              }),
                              headers: {
                                'Content-Type': 'application/json',
                              },
                            });
                            if (res && res.data && res.data.success) {
                              message.success('删除成功');
                              const List = myGoods.data.data.filter((item2) => {
                                return item.good_id != item2.good_id;
                              });
                              const oldGoodList = JSON.parse(JSON.stringify(myGoods));
                              oldGoodList.data.data = List;
                              setMyGoods(oldGoodList);
                            } else {
                              message.error('删除失败');
                            }
                          }
                        }>删除商品</Button>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <Button
            className={styles.loginout}
            type="primary"
            onClick={handleLoginout}
          >
            退出登录
          </Button>
        </Tabs.TabPane>
        <Tabs.TabPane tab="收货地址" key="2">
          <div className={styles.addressContent}>
            {
              Address.length ? Address.map((item, index) => {
                return (
                  <div className={styles.addressItem} key={Math.floor(Math.random() * 10000)}>
                    <div>收货人：{item.user_name}</div>
                    <div>联系电话：{item.user_phone}</div>
                    <div>收货地址：{item.address}</div>
                    <Button type="primary" size="small" onClick={async () => {
                      const result = await deleteAddress({ userid: user.user_id, id: item.id });
                      if (result && result.data.success) {
                        getAddressFunc();
                        message.success('删除成功');
                      } else {
                        message.error('删除失败');
                      }
                    }}>删除</Button>
                  </div>
                )
              }) : <Empty></Empty>
            }
            <div className={styles.addAddress} onClick={() => { setAddressVisible(true) }}>
              + 添加新地址
            </div>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="联系列表" key="3">
          <div className={styles.Chat}>
            <div className={styles.ChatList}>
              {
               userList.length > 0 && userList.map((item, index) => {
                  return item.user == user.user_id ? (
                    <div onClick={() => {
                      setSelectRec(index);
                      setReceiver(item?.reciveUser);
                    }} className={`${index == selectRec ? styles.active : ''} ${styles.ChatItem}`}>
                      <div style={{ float: 'left' }}>
                        <UserOutlined style={{ backgroundColor: '#87d068', marginRight: '10px' }}/>
                        {/* <Avatar style={{ backgroundColor: '#87d068', marginRight: '10px' }} icon={<UserOutlined />} /> */}
                        <span>{item?.nick_name}</span>
                      </div>
                      <span className={styles.deleteChat}>X</span>
                    </div>
                  ) :  (
                    <div onClick={() => {
                      setSelectRec(index);
                      setReceiver(item?.user);
                    }} className={`${index == selectRec ? styles.active : ''} ${styles.ChatItem}`}>
                      <div style={{ float: 'left' }}>
                        <UserOutlined style={{ backgroundColor: '#87d068', marginRight: '10px' }}/>
                        {/* <Avatar style={{ backgroundColor: '#87d068', marginRight: '10px' }} icon={<UserOutlined />} /> */}
                        <span>{item.user_nick}</span>
                      </div>
                      <span className={styles.deleteChat}>X</span>
                    </div>
                  )
                })
              }
              {/* <div className={`${styles.ChatItem}`}>
                <div style={{ float: 'left' }}>
                  <Avatar style={{ backgroundColor: '#87d068', marginRight: '10px' }} icon={<UserOutlined />} />
                  <span>用户1233455</span>
                </div>
                <span className={styles.deleteChat}>X</span>
              </div> */}
            </div>
            <div className={styles.ChatContent}>
              <div style={{ padding: '20px', height: '350px', overflow: 'auto' }}>
                {
                  chatContentList && (
                    chatContentList.map((item) => {
                      return (
                        <div style={(item.user == user.user_id) ? { textAlign: '-webkit-right' } : null}>
                          <div><span style={{ marginRight: '5px' }}>{(item.user == user.user_id) ? '自己' : '对方'}</span><span style={{ fontSize: '8px', color: 'grey' }}>{dayjs.unix(item.msg_create).format('YYYY-MM-DD HH:mm:ss')}</span></div>
                          <div className={item.user == user.user_id ? styles.popMyItem : styles.popItem}>
                            {item.msg}
                          </div>
                        </div>
                      )
                    })
                  )
                }
              </div>
              <Divider style={{ margin: '0px' }}></Divider>
              <div style={{ height: '100px', position: 'relative' }}>
                <Input.TextArea autoFocus style={{ width: '100%', height: '56%' }} resize="none" value={chatText} onChange={(e) => setChatText(e.target.value)} bordered={false}>
                </Input.TextArea>
                <Button onClick={handleSendMsg} style={{ position: 'absolute', right: '10px', bottom: '5px' }} type="primary" size="small">发送</Button>
              </div>
            </div>
          </div>
        </Tabs.TabPane>
      </Tabs>
      {
        verifyVisiable && (
          <Modal
            maskClosable={false}
            visible={verifyVisiable}
            onCancel={() => setVerifyVisiable(false)}
            onOk={onVerify}
            centered
            title="实名认证"
          >
            <div className={styles.tips}>
              身份认证的好处：
              未认证的账号无法进行购买和发布，为了让他人对您的买卖更放心，请先认证
              </div>
            <SchoolSearch
              value={school}
              changeSchool={changeSchool}
              style={{ marginTop: '15px', marginBottom: '15px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              真实姓名：<Input
                onChange={(e) => { setName(e.target.value) }}
                value={name}
                maxLength={10}
              >
              </Input>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              edu邮箱：<Input
                maxLength={50}
                addonAfter=".edu.cn"
                onChange={(e) => { setText(e.target.value) }}
                value={text}
                style={{ marginTop: '15px', marginBottom: '15px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              验证码：
                 <div style={{ display: 'flex', width: '80%' }}>
                <Input
                  maxLength={6}
                  onChange={(e) => { setCode(e.target.value) }}
                  value={code}
                >
                </Input>
                <Button
                  onClick={async () => {
                    if (text.length > 0) {
                      setifgetcode(true);
                      await request('/nodeapi/sendemail', {
                        method: 'post',
                        body: JSON.stringify({
                          email: text + '.edu.cn'
                        }),
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      });
                      let t = 60;
                      const timer = setInterval(() => {
                        t = t - 1;
                        if (t > 0) {
                          setTime(t);
                        }
                        else {
                          clearInterval(timer);
                          setifgetcode(false);
                        }
                      }, 1000);
                    } else {
                      message.error('请先输入邮箱');
                    }
                  }}
                  disabled={ifgetcode}
                >
                  {
                    ifgetcode ? `${time}秒后可以重新获取` : '获取验证码'
                  }
                </Button>
              </div>
            </div>

          </Modal>
        )
      }
      {
        addAddressVisible && (
          <Modal
            destroyOnClose
            maskClosable={false}
            visible={addAddressVisible}
            onCancel={() => setAddressVisible(false)}
            onOk={handleAddAddress}
            centered
            title="添加地址"
          >
            <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              收货人姓名：<Input
                onChange={(e) => { setGetName(e.target.value) }}
                value={getname}
                maxLength={10}
              >
              </Input>
            </div>
            <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              手机号：<Input
                onChange={(e) => { setPhone(e.target.value) }}
                value={phone}
                maxLength={20}
              >
              </Input>
            </div>
            <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              详细地址：<Input
                onChange={(e) => { setaddress(e.target.value) }}
                value={address}
                maxLength={100}
              >
              </Input>
            </div>
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

export default connect(GoodMapsState)(My);
