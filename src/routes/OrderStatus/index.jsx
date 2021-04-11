/* eslint-disable jsx-a11y/href-no-hash */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import MSearch from '../../components/PSearch';
import styles from './index.less';
import { Divider, message, Radio, Steps, Modal } from 'antd';
import { getOrderDetail, gotoPay } from '../../services/goods';
// import { UserOutlined, AccountBookOutlined } from '@ant-design/icons';

function OrderStatus(props) {

  const { auth } = props;
  const { user } = auth;
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');

  const [key, useKey] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [PayVisible, setPayVisible] = useState(false);

  useEffect(async () => {
    const result = await getOrderDetail(orderId);
    if (result && result.data.success) {
      setOrderData(result.data.data);
    }
  }, []);

  const onChangeKey = (currentKey) => {
    useKey(currentKey);
  }

  const onSearchGoods = () => {
    const { history } = props;
    history.push(`/app/goodscenter?searchkey=${key}`);
  }

  const handleGotoPay = async () => {
    const result = await gotoPay(orderId,
      orderData.user_name,
      orderData.order_total_price
    );
    if (result && result.data && result.data.success) {
      setPayVisible(true);
      window.open(result.data.url);
    }
  }

  const handleGotoOrderDetail = async () => {
    const result = await getOrderDetail(orderId);
    if (result && result.data.success) {
      if (result.data.data.order_status == 0) {
        message.warn('还未支付，请稍后');
      } else {
        message.success('支付成功');
        window.location.href = ('/app/order/detail?orderId=' + orderId);
      }
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
      <div className={styles.OrderStatusontent}>
        <Steps current={2} size="small">
          <Steps.Step title="和卖家沟通完毕" description="已经了解商品基本情况" />
          <Steps.Step title="买家下单" description="选择收货地址以及确定订单" />
          <Steps.Step title="买家支付" />
          <Steps.Step title="卖家发货" />
          <Steps.Step title="买家确认" />
        </Steps>
        <div className={styles.orderContent}>
          <h2 className={styles.orderTitle}>订单提交成功，请您尽快付款！</h2>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div className={styles.item}>订单号：{orderData?.good_order_id}</div>
            <Divider type="vertical" />
            <div className={styles.item}>应付金额：￥{orderData?.order_total_price}</div>
          </div>
          <span style={{ color: '#999999', fontSize: '12px' }}>请于24小时内完成支付，逾期未付款订单将被取消！</span>
          <div style={{ margin: '20px 0px' }}>
            <Radio></Radio>
            <img style={{ width: '85px', height: '30px' }} alt="" src="https://domy-ckf.oss-cn-hangzhou.aliyuncs.com/import/alipay.png"></img>
          </div>
          <div className={ styles.gotoPay } onClick={
            handleGotoPay
          }>去付款</div>
        </div>
      </div>
      <Modal
        centered
        title="提示"
        visible={PayVisible}
        onCancel={() => {
          setPayVisible(false);
        }}
        onOk={handleGotoOrderDetail}
        okText={"已付款，查询订单"}
      >
        请在弹出的页面中完成付款
      </Modal>
    </div>
  );
}

const GoodMapsState = (state) => {
  return {
    auth: state.auth,
  }
}

export default connect(GoodMapsState)(OrderStatus);
