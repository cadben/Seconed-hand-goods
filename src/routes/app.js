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
    const { children, auth, location } = this.props;
    const { pathname } = location;
    console.log(pathname);
    return (
      <Layout className={styles.layout}>
        {
          (pathname === '/app/login') ? null : (<MHeader
            Auth={auth}
          />) 
        }
        <Content
          style={pathname === '/app/login' ? { padding: '0px 0px' } : null}
        >
          {children}
        </Content>
        {
          (pathname === '/app/login') ? null : (<Footer>
            &copy; 2021 版权所有
          </Footer>)
        }
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