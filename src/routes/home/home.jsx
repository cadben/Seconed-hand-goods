import React, { useState } from 'react';
import { connect } from 'dva';
import styles from './home.less';
import { Carousel } from 'antd';
import { category, tag } from '../../models/category';
import MSearch from '../../components/Search/index';
import { Link } from 'dva/router';

function HomePage() {

  const [keyword, setKeyword] = useState('');

  const onChangeKey = (key) => {
    setKeyword(key);
  }

  const onSearchGoods = (key) => {
    console.log('搜key', key);
  }

  // const BannerLists = [
  //   {
  //     backgroundImage: 'url(https://aecpm.alicdn.com/tps/i2/TB10vPXKpXXXXacXXXXvKyzTVXX-520-280.jpg)'
  //   },
  //   {
  //     backgroundImage: 'url(https://aecpm.alicdn.com/tps/i2/TB10vPXKpXXXXacXXXXvKyzTVXX-520-280.jpg)'
  //   }
  // ]
  console.log(category, tag);
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
        <div className={styles.toPublish}>
          <img src="https://cdn.jsdelivr.net/gh/cadben/images_store@master/img/publishButton-pic.png"/>
          {/* 发布商品 */}
        </div>
        {/* <Carousel
          autoplay
          autoplaySpeed={4000}
        >
        <div>
          <div style={BannerLists[0]} className={styles.bg}></div>
        </div>
        </Carousel> */}
      </div>
    </div>
  );
}

HomePage.propTypes = {
};

export default connect()(HomePage);
