import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import MHeader from '../components/Header/head';
// import { withRouter, Link } from 'dva/router';
import styles from './app.less';

const { Footer, Content } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children } = this.props;
    return (
      <Layout className={styles.layout}>
        <MHeader/>
        <Content>
          {children}
        </Content>
        <Footer>
          &copy; 2021 版权所有
        </Footer>
      </Layout>
    )
  }
}

export default connect()(App);