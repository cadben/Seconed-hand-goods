import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Input } from 'antd';
class LoginPage extends React.Component {
  render() {
    return (
      <div className={styles.loginPage}>
        
      </div>
    );
  }
}

LoginPage.propTypes = {
};

export default connect()(LoginPage);
