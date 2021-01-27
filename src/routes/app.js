import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import MHeader from '../components/Header/head';
import { withRouter } from 'dva/router';
import styles from './app.less';

const { Footer, Content } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, auth } = this.props;
    return (
      <Layout className={styles.layout}>
        <MHeader
          Auth={auth}
        />
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

const AppmapProps = (state) => {
  console.log('123', state);
  return {
    auth: state.auth,
  }
}

export default withRouter(connect(AppmapProps)(App));