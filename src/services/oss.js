import request from '../utils/request';

export function getOSSSTS() {
  return request('/nodeapi/getsts');
}

export function getBaiduVerift(img) {
  return request('/nodeapi/getbaidu', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ img }),
  });
}

export function getGoodPrice(key) {
  return request(`/nodeapi/getprice?key=${key}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
