import request from '../utils/request';
import qs from 'qs';

export function getGoodsLists(data) {
  const query = qs.stringify(data, { encode: false, arrayFormat: 'repeat' });
  return request('/nodeapi/getgoodlists?' + query);
}
