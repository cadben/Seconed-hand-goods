import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import MSearch from '../../components/PSearch';
import qs from 'query-string';
import GoodsItem from '../../components/GoodsItem/index';

import styles from './index.less';
import { Pagination } from 'antd';

function GoodsCenter(props) {
  const { location, dispatch } = props;
  const { search } = location;
  const { searchkey } = qs.parse(search);
  const [key, useKey] = useState(searchkey);
  const [pageNo, usePageNo] = useState(1);
  const [pageSize, usePageSize] = useState(20);
  const [total, useTotal] = useState(0);

  useEffect(() => {
    getLists();
  }, []);

  const getLists = async () => {
    const result = await dispatch({
      type: 'GoodsCenter/getGoodLists',
      payload: {
        key,
        pageNo,
        pageSize,
        total,
      },
    });
    const currenttotal = result.total;
    useTotal(currenttotal);
  }

  const onChangeKey = (currentKey) => {
   useKey(currentKey);
  }

  const onSearchGoods = (key) => {
    const { history } = props;
    history.push(`/app/goodscenter?searchkey=${key}`);
    getLists();
  }

  return (
    <div>
      <MSearch
        keyword={key}
        onChange={onChangeKey}
        onMyClick={onSearchGoods}
      />
      <GoodsItem></GoodsItem>
      {
        total > 0 && (<Pagination current={pageNo} total={total} size={pageSize}/>)
      }
    </div>
  );
}

const GoodMapsState = (state) => {
  return {
    goodLists: state.GoodsCenter.GoodLists,
  }
}

export default connect(GoodMapsState)(GoodsCenter);
