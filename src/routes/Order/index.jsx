/* eslint-disable jsx-a11y/href-no-hash */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import MSearch from '../../components/PSearch';
import styles from './index.less';
import { Steps, Row, Col, Tag, Input, message, Spin } from 'antd';
// import { UserOutlined, AccountBookOutlined } from '@ant-design/icons';
import { getLogin, getAddress } from '../../services/auth';
import { getGoodDetail, handleSubmitOrder } from '../../services/goods';

function Order(props) {

  const { auth } = props;
  const { user } = auth;
  const url = new URL(window.location.href);
  const goodId = url.searchParams.get('goodId');

  const [key, useKey] = useState('');
  const [Address, setAddress] = useState([]);
  const [activeAddress, setActiveAddress] = useState(0);
  const [data, setData] = useState({});
  const [text, setText] =useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setText(e.target.value);
  }

  const getAddressFunc = async () => {
    if (Object.keys(user).length === 0) {
      const result = getLogin();
      result.then(async res => {
        if (res && res.data && res?.data?.success) {
          const result2 = await getAddress({ userId: res.data.data.user_id });
          setAddress(result2.data);
        }
      });
    } else {
      const result2 = await getAddress({ userId: user.user_id });
      setAddress(result2.data);
    }
  }

  useEffect(async () => {
    if (goodId) {
      const result = await getGoodDetail(goodId);
      if (result && result?.data?.success) {
        setData(result.data.data);
      }
    }
  }, [goodId]);

  useEffect(() => {
    getAddressFunc();
  }, []);

  const onChangeKey = (currentKey) => {
    useKey(currentKey);
  }

  const onSearchGoods = () => {
    const { history } = props;
    window.location.href = (`/app/goodscenter?searchkey=${key}`);
  }

  const onhandleSubmitOrder = async () => {
    setLoading(true);
    const result = await handleSubmitOrder(data.good_id, props.auth.user.user_id, data.good_user, Address[activeAddress], text, (data.good_out_price + data.good_transportation_price));
    if (result && result.data.success) {
      setTimeout(() => {
        message.success('提交成功');
        window.location.href = '/app/order/status?orderId=' + result.data.orderId;
        setLoading(false);
      });
    } else {
      message.success('提交失败');
      setLoading(false);
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
      <div className={styles.AddressContent}>
        <Steps current={1} size="small">
          <Steps.Step title="和卖家沟通完毕" description="已经了解商品基本情况" />
          <Steps.Step title="买家下单" description="选择收货地址以及确定订单" />
          <Steps.Step title="买家支付" />
          <Steps.Step title="卖家发货" />
          <Steps.Step title="买家确认" />
        </Steps>
        <div className={styles.verifyAddress}>
          <h3>核对收货人信息</h3>
          <Row gutter={[16, 16]}>
            {
              Address.length ? Address.map((item, index) => {
                return (
                  <Col span={8} >
                    <div onClick={() => { setActiveAddress(index); }} className={`${styles.addressItem} ${activeAddress === index ? styles.activeAddressItem : ''}`} key={Math.floor(Math.random() * 10000)}>
                      <div>收货人：{item.user_name}</div>
                      <div>联系电话：{item.user_phone}</div>
                      <div>收货地址：{item.address}</div>
                    </div>
                  </Col>
                )
              }) : null
            }
          </Row>
        </div>
        <div style={{ marginTop: '40px' }}>
          <h3>确认订单信息</h3>
          {
            data && (
              <div className={styles.verifyOrder}>
                <div style={{ borderBottom: '1px', padding: '20px' }}>
                  卖家：{data.user_nick}
                </div>
                <div className={styles.orderHeader}>
                  <span style={{ flex: '3' }}>商品信息</span>
                  <span>单价</span>
                  <span>数量</span>
                  <span>小计</span>
                </div>
                <div className={styles.orderContent}>
                  <div className={styles.good_detail}>
                    {
                      data.imgs && data.imgs.length > 0 && (<img
                        alt=""
                        src={data?.imgs[0]?.good_img_src}
                      />)
                    }
                    <div className={styles.detail}>
                      <div><Tag color="#eb9a4e">闲置</Tag>{data.good_name}</div>
                      <div style={{ color: 'grey' }}>{data.good_category}</div>
                    </div>
                  </div>
                  <div className={styles.generateItem}>￥{data.good_out_price?.toFixed(2)}</div>
                  <div className={styles.generateItem}>1</div>
                  <div className={styles.generateItem}>￥{data.good_out_price?.toFixed(2)}</div>
                </div>
                <div className={styles.orderFooter}>
                  <div style={{ marginRight: '10px'}}>运费：￥{data.good_transportation_price?.toFixed(2)}</div>
                  <div style={{ fontSize: '16px' }}>总计：<span style={{ color: 'red' }}>￥{(data.good_out_price + data.good_transportation_price)?.toFixed(2)}</span></div>
                </div>
              </div>
            )
          }
          <div className={styles.OrderComment}>
            <Input.TextArea placeholder="给卖家留言" value={text} showCount maxLength={100} onChange={onChange} />
          </div>
          <div className={styles.addOrderBt} onClick={onhandleSubmitOrder}>
            <Spin spinning={loading}>
              提交订单
            </Spin>
          </div>
        </div>
      </div>

    </div>
  );
}

const GoodMapsState = (state) => {
  return {
    auth: state.auth,
  }
}

export default connect(GoodMapsState)(Order);
