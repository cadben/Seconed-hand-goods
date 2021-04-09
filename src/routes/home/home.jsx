import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import styles from './home.less';
import { category, tag } from '../../models/category';
import MSearch from '../../components/Search/index';
import { Link } from 'dva/router';
import { message } from 'antd';
import ReactPlayer from 'react-player';

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

  const gotoDetail = (id) => {
    const { history } = props;
    history.push(`/app/good/${id}`);
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
              return (<div className={styles.goodItem} onClick={gotoDetail.bind(this, item.good_id)}>
                <div className={styles.goodItemSrc} style={{ backgroundImage: `url(${item.good_img_src})` }}></div>
                <div style={{ padding: '0px 20px' }}>
                  <div className={styles.goodItemTitle}>{item.good_name}</div>
                  <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className={styles.goodItemPrice}>¥ {item.good_out_price}</div>
                    <div style={{ color: '#494949', fontSize: '12px' }}>{item.school_name}</div>
                  </div>
                </div>
              </div>);
            })
          }
        </div>
      </div>
      <div className={styles.bottomContent}>
        <h3>校园二手</h3>
        <ReactPlayer 
          controls
          width="1220px"
          height="440px"
          url='http://domy-ckf.oss-cn-hangzhou.aliyuncs.com/import/5561811-dd340ac7490af5eca2b2bfb50c24965c.mp4'
        />
      </div>
    </div>
  );
}

const pageMapPropsState = (state) => {
  return {
    RecommendLists: state.GoodsCenter.RecommendLists,
    auth: state.auth,
  }
}

export default connect(pageMapPropsState)(HomePage);
