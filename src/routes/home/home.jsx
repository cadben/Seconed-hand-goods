import React, { useState } from 'react';
import { connect } from 'dva';
import styles from './home.less';
import MSearch from '../../components/Search/index';

function HomePage() {

  const [keyword, setKeyword] = useState('');

  const onChangeKey = (key) => {
    setKeyword(key);
  }

  const onSearchGoods = (key) => {
    console.log('搜key', key);
  }

  return (
    <div className={styles.homePage}>
      <MSearch
        keyword={keyword}
        onChange={onChangeKey}
        onMyClick={onSearchGoods}
      />
    </div>
  );
}

HomePage.propTypes = {
};

export default connect()(HomePage);
