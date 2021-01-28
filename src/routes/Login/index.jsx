import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { CSSTransition } from 'react-transition-group' // ES6
import { Input } from 'antd';
class LoginPage extends React.Component {
  render() {
    return (
      <div className={styles.loginPage}>
        <CSSTransition>
          {/* <div className={styles.LoginContent}>
            <Input></Input>
            <Input></Input>
          </div> */}
          {"asdasd"}
        </CSSTransition>
      </div>
    );
  }
}

LoginPage.propTypes = {
};

export default connect()(LoginPage);
