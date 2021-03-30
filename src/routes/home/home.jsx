import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import styles from './home.less';
import { category, tag } from '../../models/category';
import MSearch from '../../components/Search/index';
import { Link } from 'dva/router';
import { message } from 'antd';

function HomePage(props) {

  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const { dispatch } = props;
    dispatch({
      type: 'GoodsCenter/getRecommendLists',
      payload: {},
    });
  }, []);

  const onChangeKey = (key) => {
    setKeyword(key);
  }

  const onSearchGoods = (key) => {
    const { history } = props;
    console.log('搜key', key);
    history.push(`/app/goodscenter?searchkey=${key}`);
  }

  const goToPublish = (e) => {
    e.preventDefault();
    const { history, auth } = props;
    history.push('/app/publish');
    if (auth && auth.user && auth.user.user_name) {
      history.push('/app/publish');
    } else {
      message.error('请先登录');
      history.push('/app/login');
    }
  }

  const { RecommendLists } = props;
  return (
    <div className={styles.homePage}>
      <MSearch
        keyword={keyword}
        onChange={onChangeKey}
        onMyClick={onSearchGoods}
      />
      <div className={styles.navContent}>
        <div className={styles.navLeft}>
          <div className={styles.navTitle}>商品分类</div>
          {
            tag.map((item, index) => {
              return (
                <div className={styles.navLeftItem} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {/* <div>{item}</div> */}
                  <Link to={`/app/goodscenter?searchkey=${item}`}>{item}</Link>
                  <div> {">"} </div>
                  <div className={styles.popNav}>
                    {
                      category[index].map((titles) => {
                        return (<div className={styles.popNavItem}>
                          <h5 className={styles.PopNavItemTitle}>{titles.title}</h5>
                          {
                            titles.items.map((i) => {
                              return (<Link to={`/app/goodscenter?searchkey=${i.search_name}`}>{i.show_name}</Link>)
                            })
                          }
                        </div>)
                      })
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className={styles.toPublish} onClick={goToPublish}>
          <img alt="" src="https://cdn.jsdelivr.net/gh/cadben/images_store@master/img/publishButton-pic.png"/>
          {/* 发布商品 */}
        </div>
      </div>
      <div className={styles.goodsCenter}>
        <h2 className={styles.topTitle}>商品推荐</h2>
        <div className={styles.content}>
          {
            RecommendLists.map((item, index) => {
              return (<div className={styles.goodItem}>
                <div className={styles.goodItemSrc} style={{ backgroundImage: `url(${item.imgsrc})` }}></div>
                <div style={{ padding: '0px 20px' }}>
                  <div className={styles.goodItemTitle}>{item.name}</div>
                  <div className={styles.goodItemPrice}>¥ {item.price}</div>
                </div>
              </div>);
            })
          }
        </div>
      </div>
    </div>
  );
}

const pageMapPropsState = (state) => {
  console.log(state.auth);
  return {
    RecommendLists: state.GoodsCenter.RecommendLists,
    auth: state.auth,
  }
}

export default connect(pageMapPropsState)(HomePage);
