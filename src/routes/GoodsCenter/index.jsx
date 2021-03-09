import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import MSearch from '../../components/PSearch';
import qs from 'query-string';
import GoodsItem from '../../components/GoodsItem/index';

import styles from './index.less';
import { Pagination, Spin, Empty } from 'antd';

function GoodsCenter(props) {
  const { location, dispatch, goodLists } = props;
  const { search } = location;
  const { searchkey } = qs.parse(search);
  const [key, useKey] = useState(searchkey);
  const [pageNo, usePageNo] = useState(1);
  const [pageSize, usePageSize] = useState(10);
  const [total, useTotal] = useState(0);
  const [list1, useList1] = useState([]);
  const [list2, useList2] = useState([]);
  const [list3, useList3] = useState([]);
  const [list4, useList4] = useState([]);
  const [list0, useList0] = useState([]);
  const [loading, useLoading] = useState(false);
  const ProviderRef = useRef();

  useEffect(() => {
    getLists();
  }, []);

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

  const getLists = async (currentpageNo, currentkey) => {
    clear();
    useLoading(true);
    const result = await dispatch({
      type: 'GoodsCenter/getGoodLists',
      payload: {
        key: currentkey ? currentkey : key,
        pageNo: currentpageNo ? currentpageNo : pageNo,
        pageSize,
        total,
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
    getLists(page);
  }

  const onSearchGoods = () => {
    const { history } = props;
    if (searchkey !== key) {
      history.push(`/app/goodscenter?searchkey=${key}`);
      usePageNo(1);
      getLists();
    }
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
        <div className={styles.GoodsProvide} ref={ProviderRef}>
          <div className={styles.GoodsCol} key="1">
            {
              (list0.length > 0) && list0.map((item, index) => {
                return (
                  <GoodsItem ItemData={item}></GoodsItem>
                )
              })
            }
          </div>
          <div className={styles.GoodsCol} key="2">
            {
              (list1.length > 0) && list1.map((item, index) => {
                return (
                  <GoodsItem ItemData={item}></GoodsItem>
                )
              })
            }
          </div>
          <div className={styles.GoodsCol} key="3">
            {
              (list2.length > 0) && list2.map((item, index) => {
                return (
                  <GoodsItem ItemData={item}></GoodsItem>
                )
              })
            }
          </div>
          <div className={styles.GoodsCol} key="4">
            {
              (list3.length > 0) && list3.map((item, index) => {
                return (
                  <GoodsItem ItemData={item}></GoodsItem>
                )
              })
            }
          </div>
          <div className={styles.GoodsCol} key="5">
            {
              (list4.length > 0) && list4.map((item, index) => {
                return (
                  <GoodsItem ItemData={item}></GoodsItem>
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
