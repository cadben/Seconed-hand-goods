import request from '../utils/request';
import qs from 'qs';

export function getGoodsLists(data) {
  const query = qs.stringify(data, { encode: false, arrayFormat: 'repeat' });
  return request('/nodeapi/getgoodlists?' + query);
}

export function getGoodsRand() {
  return request('/nodeapi/getrand');
}

export function getGoodDetail(goodid) {
  return request('/nodeapi/getgood?goodId=' + goodid);
}

export function addComment(content, goodId, user) {
  return request('/nodeapi/addcomment', {
    method: 'post',
    body: JSON.stringify({
      content,
      user,
      goodId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function handleSubmitOrder(goodId, userId, goodUserId, addressObj, comments, totalPrice) {
  return request('/nodeapi/addorder', {
    method: 'post',
    body: JSON.stringify({
      goodId,
      userId,
      goodUserId,
      comments,
      addressObj,
      totalPrice,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export function getOrderDetail(orderId) {
  return request('/nodeapi/getorder?orderId=' + orderId);
}

export function gotoPay(orderId, name, price) {
  return request('/nodeapi/aliPay', {
    method: 'post',
    body: JSON.stringify({
      orderId,
      name,
      price
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}