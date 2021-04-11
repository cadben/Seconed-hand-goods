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

export function LoginOut() {
  const result = request('/nodeapi/loginout', {
    method: 'post',
  });
  return result;
}

export function verify({ name, userId, email, inputcode, school }) {
  const result = request('/nodeapi/verifyemail', {
    method: 'post',
    body: JSON.stringify({
      name,
      userId,
      email,
      inputcode,
      school,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return result;
}

export function getAddress({ userId }) {
  const result = request('/nodeapi/getaddress?id=' + userId);
  return result;
}

export function addAddress({ userid, phone, name, address }) {
  const result = request('/nodeapi/address', {
    method: 'post',
    body: JSON.stringify({
      userid,
      address,
      phone,
      name,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return result;
}

export function deleteAddress({ userid, id }) {
  const result = request('/nodeapi/deleteaddress', {
    method: 'post',
    body: JSON.stringify({
      userid,
      id,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return result;
}