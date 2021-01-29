
export default {

  namespace: 'auth',
  state: {
    user: {
      // name: 'ckf'
    },
  },

  effects: {
    *toLogin({ payload }, { call, put }) {
      // const result = yield call();
      console.log(payload);
      yield put({
        type: 'saveAuth',
        payload: {
          user: {
            name: 'ckf',
          }
        },
      });
      return true;
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
