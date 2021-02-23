
export default {

  namespace: 'GoodsCenter',
  state: {
    RecommendLists: [],
  },

  effects: {
    *getRecommendLists({ payload }, { call, put }) {
      // const result = yield call();
      console.log('触发');
      yield put({
        type: 'saveRecommendLists',
        payload: {
          RecommendLists: [
            {
              id: '1',
              name: '佳能 AE-1 Program+50/1.4（5759）',
              price: '1350.2',
              imgsrc: 'https://cdn.jsdelivr.net/gh/cadben/images_store@master/img/0c9356c68700c5ef714209407de74cc3.jpg',
            },
            {
              id: '1',
              name: '佳能 AE-1 Program+50/1.4（5759）',
              price: '1350.2',
              imgsrc: 'https://cdn.jsdelivr.net/gh/cadben/images_store@master/img/0c9356c68700c5ef714209407de74cc3.jpg',
            },
            {
              id: '1',
              name: '佳能 AE-1 Program+50/1.4（5759）',
              price: '1350.2',
              imgsrc: 'https://cdn.jsdelivr.net/gh/cadben/images_store@master/img/0c9356c68700c5ef714209407de74cc3.jpg',
            },
            {
              id: '1',
              name: '佳能 AE-1 Program+50/1.4（5759）',
              price: '1350.2',
              imgsrc: 'https://cdn.jsdelivr.net/gh/cadben/images_store@master/img/0c9356c68700c5ef714209407de74cc3.jpg',
            },
            {
              id: '1',
              name: '佳能 AE-1 Program+50/1.4（5759）',
              price: '1350.2',
              imgsrc: 'https://cdn.jsdelivr.net/gh/cadben/images_store@master/img/0c9356c68700c5ef714209407de74cc3.jpg',
            },
            {
              id: '1',
              name: '佳能 AE-1 Program+50/1.4（5759）',
              price: '1350.2',
              imgsrc: 'https://cdn.jsdelivr.net/gh/cadben/images_store@master/img/0c9356c68700c5ef714209407de74cc3.jpg',
            }
          ],
        },
      });
      return true;
    },
  },

  reducers: {
    saveRecommendLists(state, { payload: { RecommendLists } }) {
      console.log('出发了2', RecommendLists);
      return {
        ...state,
        RecommendLists,
      }
    },
  },

};
