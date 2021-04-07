import request from '../utils/request';

export function register(data) {
  return request(`/nodeapi/register`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function login(data) {
  const result = request(`/nodeapi/login`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return result;
}

export function getLogin() {
  const result = request(`/nodeapi/getuser`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return result;
}