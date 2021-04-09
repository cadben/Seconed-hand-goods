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