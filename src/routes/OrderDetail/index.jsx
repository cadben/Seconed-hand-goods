/* eslint-disable jsx-a11y/href-no-hash */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import MSearch from '../../components/PSearch';
import styles from './index.less';
import { Divider, Steps, Tag } from 'antd';
import { getOrderDetail, getGoodDetail } from '../../services/goods';
// import { UserOutlined, AccountBookOutlined } from '@ant-design/icons';
import { status } from '../../utils/util';

function OrderStatus(props) {

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');

  const [key, useKey] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [data, setData] = useState(null);

  useEffect(async () => {
    const result = await getOrderDetail(orderId);
    if (result && result.data.success) {
      setOrderData(result.data.data);
      const result2 = await getGoodDetail(result.data.data.good_id);
      if (result2 && result2?.data?.success) {
        setData(result2.data.data);
      }
    }
  }, []);

  const onChangeKey = (currentKey) => {
    useKey(currentKey);
  }

  const onSearchGoods = () => {
    const { history } = props;
    history.push(`/app/goodscenter?searchkey=${key}`);
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
        <Steps current={3} size="small">
          <Steps.Step title="和卖家沟通完毕" description="已经了解商品基本情况" />
          <Steps.Step title="买家下单" description="选择收货地址以及确定订单" />
          <Steps.Step title="买家支付" />
          <Steps.Step title="卖家发货" />
          <Steps.Step title="买家确认" />
        </Steps>
        <div className={styles.orderContent}>
          <h2 className={styles.orderTitle}>当前订单状态：{status[orderData?.order_status]}</h2>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div className={styles.item}>订单号：{orderData?.good_order_id}</div>
            <Divider type="vertical" />
            <div className={styles.item}>金额：￥{orderData?.order_total_price}</div>
          </div>
          <span style={{ color: '#999999', fontSize: '12px' }}>请和卖家联系具体发货时间</span>
        </div>
        {
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
                 <div className={styles.orderContent2}>
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
                 <div style={{ padding: '0px 20px' }}>留言：{orderData.comments ? orderData.comments : '无'}</div>
                 <div className={styles.orderFooter}>
                   <div>
                      <div style={{ color: '#666666' }}>收货人：{orderData.user_name}</div>
                      <div style={{ color: '#666666' }}>联系电话：{orderData.user_phone}</div>
                      <div style={{ color: '#666666' }}>收货地址：{orderData.address}</div>
                   </div>
                   <div>
                    <div style={{ marginRight: '10px' }}>运费：￥{data.good_transportation_price?.toFixed(2)}</div>
                    <div style={{ fontSize: '16px' }}>实付款：<span style={{ color: 'red' }}>￥{(data.good_out_price + data.good_transportation_price)?.toFixed(2)}</span></div>
                  </div>
                 </div>
               </div>
             )
           }
         </div>
        }
      </div>
    </div>
  );
}

const GoodMapsState = (state) => {
  return {
    auth: state.auth,
  }
}

export default connect(GoodMapsState)(OrderStatus);
