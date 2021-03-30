import { register, login } from '../services/auth';

export default {

  namespace: 'auth',
  state: {
    user: {
    },
  },

  effects: {
    *toLogin({ payload }, { call, put }) {
      const result = yield call(login, payload);
      if (result.data && result.data.success) {
        yield put({
          type: 'saveAuth',
          payload: {
            user: result.data.data,
          },
        });
      }
      return result;
    },
    *toRegister({ payload }, { call, put }) {
      const result = yield call(register, payload);
      return result;
    },
  },

  reducers: {
    saveAuth(state, { payload: { user } }) {
      return {
        ...state,
        user,
      }
    },
  },

};
