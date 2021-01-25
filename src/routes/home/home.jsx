import React from 'react';
import { connect } from 'dva';
import styles from './home.less';
import Header from '../../components/Header/head';

function HomePage() {
  return (
    <div className={styles.homePage}>
      <Header></Header>
    </div>
  );
}

HomePage.propTypes = {
};

export default connect()(HomePage);
