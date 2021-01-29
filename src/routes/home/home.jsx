import React, { useState } from 'react';
import { connect } from 'dva';
import styles from './home.less';
import { Carousel } from 'antd';
import MSearch from '../../components/Search/index';

function HomePage() {

  const [keyword, setKeyword] = useState('');

  const onChangeKey = (key) => {
    setKeyword(key);
  }

  const onSearchGoods = (key) => {
    console.log('搜key', key);
  }

  const BannerLists = [
    {
      backgroundImage: 'url(https://aecpm.alicdn.com/tps/i2/TB10vPXKpXXXXacXXXXvKyzTVXX-520-280.jpg)'
    },
    {
      backgroundImage: 'url(https://aecpm.alicdn.com/tps/i2/TB10vPXKpXXXXacXXXXvKyzTVXX-520-280.jpg)'
    }
  ]

  return (
    <div className={styles.homePage}>
      <MSearch
        keyword={keyword}
        onChange={onChangeKey}
        onMyClick={onSearchGoods}
      />
      <div className={styles.navContent}>
        <div className={styles.navLeft}>
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>
        </div>
        <Carousel
          autoplay
          autoplaySpeed={4000}
        >
        <div>
          <div style={BannerLists[0]} className={styles.bg}></div>
        </div>
        </Carousel>
      </div>
    </div>
  );
}

HomePage.propTypes = {
};

export default connect()(HomePage);
