import * as services from '../services/goods';

export default {

  namespace: 'GoodsCenter',
  state: {
    RecommendLists: [],
    GoodLists: [],
  },

  effects: {
    *getRecommendLists({ payload }, { call, put }) {
      const result = yield call(services.getGoodsRand);
      console.log(result);
      if (result && result.data && result.data.success) {
        yield put({
          type: 'saveRecommendLists',
          payload: {
            RecommendLists: result.data.data,
          },
        });
      }
      return true;
    },
    *getGoodLists({ payload }, { call, put }) {
      const result = yield call(services.getGoodsLists, payload);
      const { data } = result;
      if (data.GoodLists) {
        yield put({
          type: 'saveGoodLists',
          payload: {
            GoodLists: data.GoodLists,
          },
        });
      } else {
        yield put({
          type: 'saveGoodLists',
          payload: {
            GoodLists: [],
          },
        });
      }
      return data;
    },
  },

  reducers: {
    saveRecommendLists(state, { payload: { RecommendLists } }) {
      return {
        ...state,
        RecommendLists,
      }
    },
    saveGoodLists(state, { payload: { GoodLists } }) {
      return {
        ...state,
        GoodLists,
      }
    },
  },

};
