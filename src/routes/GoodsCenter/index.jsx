/* eslint-disable jsx-a11y/href-no-hash */
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import MSearch from '../../components/PSearch';
import qs from 'query-string';
import GoodsItem from '../../components/GoodsItem/index';

import styles from './index.less';
import { Pagination, Spin, Empty, Divider } from 'antd';

function GoodsCenter(props) {
  const { location, dispatch, goodLists, history } = props;
  const { search } = location;
  const { searchkey } = qs.parse(search);
  const [key, useKey] = useState(searchkey);
  const [pageNo, usePageNo] = useState(1);
  const [pageSize] = useState(30);
  const [total, useTotal] = useState(0);
  const [list1, useList1] = useState([]);
  const [list2, useList2] = useState([]);
  const [list3, useList3] = useState([]);
  const [list4, useList4] = useState([]);
  const [list0, useList0] = useState([]);
  const [loading, useLoading] = useState(false);
  const ProviderRef = useRef();
  const [sortKey, setSortKey] = useState(0);

  useEffect(() => {
    getLists({});
  }, []);

  const gotoDetail = (id) => {
    history.push(`/app/good/${id}`);
  }

  const clear = () => {
    useList1([]);
    useList2([]);
    useList3([]);
    useList4([]);
    useList0([]);
  }

  const setLayoutLists = (datas) => {
    const { childNodes } = ProviderRef.current;
    const l0 = [];
    const l1 = [];
    const l2 = [];
    const l3 = [];
    const l4 = [];
    datas.forEach((item, index) => {
      const currentIndex = getMinHeightDiv(childNodes);
      switch (currentIndex) {
        case 0:
          l0.push(item);
          useList0([...l0]);
          break;
        case 1:
          l1.push(item);
          useList1([...l1]);
          break;
        case 2:
          l2.push(item);
          useList2([...l2]);
          break;
        case 3:
          l3.push(item);
          useList3([...l3]);
          break;
        case 4:
          l4.push(item);
          useList4([...l4]);
          break;
        default:
          break;
      }
    });
  }

  const getMinHeightDiv = (childNodes) => {
    let min = 0;
    childNodes[min] && childNodes.forEach((item, index) => {
      if (item.offsetHeight < childNodes[min].offsetHeight) {
        min = index;
      };
    });
    return min;
  }

  const getLists = async (query) => {
    const { currentpageNo, currentkey, _sortKey = sortKey } = query;
    let order = '';
    let desc = '';
    if (_sortKey === 1) {
      order= 'good_browse';
      desc= true;
    } else if (_sortKey === 2) {
      order = 'good_create_time';
      desc = true;
    } else if (_sortKey === 3 || _sortKey === 4) {
      order = 'good_out_price';
      desc = _sortKey === 3 ? true : '';
    }
    clear();
    useLoading(true);
    const result = await dispatch({
      type: 'GoodsCenter/getGoodLists',
      payload: {
        key: currentkey ? currentkey : key,
        pageNo: currentpageNo ? currentpageNo : pageNo,
        pageSize,
        total,
        order: order ? order : '',
        desc: desc ? desc : '',
      },
    });
    if (result.total) {
      const currenttotal = result.total;
      setLayoutLists(result.GoodLists);
      useTotal(currenttotal);
    } else {
      useTotal(0);
      clear();
    }
    useLoading(false);
  }

  const onChangeKey = (currentKey) => {
    useKey(currentKey);
  }

  const onChangePage = (page) => {
    usePageNo(page);
    getLists({ currentpageNo: page });
  }

  const onSearchGoods = () => {
    const { history } = props;
    if (searchkey !== key) {
      history.push(`/app/goodscenter?searchkey=${key}`);
      usePageNo(1);
      getLists({});
    }
  }

  const onSortKey = (currentKey, e) => {
    e.preventDefault();
    setSortKey(currentKey);
    getLists({
      _sortKey: currentKey,
    });
  }

  return (
    <div>
      <div style={{ marginTop: '20px' }}>
        <MSearch
          keyword={key}
          onChange={onChangeKey}
          onMyClick={onSearchGoods}
        />
      </div>
      <Spin spinning={loading}>
        <div className={styles.sortDiv}>
            <a href="" className={ sortKey == 1 ? styles.aactive : '' } onClick={onSortKey.bind(this, 1)}>热度最高</a>
            <Divider type="vertical" />
            <a href="" className={ sortKey == 2 ? styles.aactive : '' } onClick={onSortKey.bind(this, 2)}>最新发布</a>
            <Divider type="vertical" />
            <a href="" className={ sortKey == 3 ? styles.aactive : '' } onClick={onSortKey.bind(this, 3)}>价格从高到低</a>
            <Divider type="vertical" />
            <a href="" className={ sortKey == 4 ? styles.aactive : '' } onClick={onSortKey.bind(this, 4)}>价格从低到高</a>
        </div>
        <div className={styles.GoodsProvide} ref={ProviderRef}>
          <div className={styles.GoodsCol} key="1">
            {
              (list0.length > 0) && list0.map((item, index) => {
                return (
                  <GoodsItem ItemData={item} key={Math.random() * 10000} gotoDetail={gotoDetail.bind(this, item.good_id)}></GoodsItem>
                )
              })
            }
          </div>
          <div className={styles.GoodsCol} key="2">
            {
              (list1.length > 0) && list1.map((item, index) => {
                return (
                  <GoodsItem ItemData={item} key={Math.random() * 10000} gotoDetail={gotoDetail.bind(this, item.good_id)}></GoodsItem>
                )
              })
            }
          </div>
          <div className={styles.GoodsCol} key="3">
            {
              (list2.length > 0) && list2.map((item, index) => {
                return (
                  <GoodsItem ItemData={item} key={Math.random() * 10000} gotoDetail={gotoDetail.bind(this, item.good_id)}></GoodsItem>
                )
              })
            }
          </div>
          <div className={styles.GoodsCol} key="4">
            {
              (list3.length > 0) && list3.map((item, index) => {
                return (
                  <GoodsItem ItemData={item} key={Math.random() * 10000} gotoDetail={gotoDetail.bind(this, item.good_id)}></GoodsItem>
                )
              })
            }
          </div>
          <div className={styles.GoodsCol} key="5">
            {
              (list4.length > 0) && list4.map((item, index) => {
                return (
                  <GoodsItem ItemData={item} key={Math.random() * 10000} gotoDetail={gotoDetail.bind(this, item.good_id)}></GoodsItem>
                )
              })
            }
          </div>
      </div>
      {
        total > 0 ? (<Pagination current={pageNo} total={total} pageSize={pageSize} showSizeChanger={false} onChange={onChangePage}/>) : <Empty/>
      }
      </Spin>
    </div>
  );
}

const GoodMapsState = (state) => {
  return {
    goodLists: state.GoodsCenter.GoodLists,
  }
}

export default connect(GoodMapsState)(GoodsCenter);
