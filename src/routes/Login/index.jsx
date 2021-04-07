import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import QueueAnim from 'rc-queue-anim';
import { Input, Tabs, Form, Button, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const { TabPane } = Tabs;
class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: '1',
      loading: false,
    }
  }
  AccountRef = React.createRef();
  Register = React.createRef();
  PhoneLoginRef = React.createRef();

  LengthValidator = (rule, value, callback) => {
    if (value.length < 8) {
      callback('长度不能低于8位数')
    }
    callback();
  }

  passwordValidator = (rule, value, callback) => {
    const { getFieldValue } = this.Register.current;
    if (value && value !== getFieldValue('register_password1')) {
      callback('两次输入不一致！')
    }
    if (value.length < 8) {
      callback('密码长度不能低于8位数')
    }
    callback();
  }

  handleCheckoutTab = (e) => {
    this.setState((renderState) => {
      return {
        tabKey: `${e}`,
      }
    });
  }

  onFinishLogin = async () => {
    const { getFieldValue } = this.AccountRef.current;
    const { history } = this.props;
    const account = getFieldValue('account');
    const password = getFieldValue('password');
    const result = await this.props.dispatch({
      type: 'auth/toLogin',
      payload: {
        account,
        password,
      },
    });
    if (result && result.data.success) {
      message.success('登录成功');
      history.push('/app');
      
    } else {
      message.error(result.data.msg);
    }
  }

  handleRegister = async () => {
    this.setState({
      loading: true
    });
    const { getFieldValue } = this.Register.current;
    const account = getFieldValue('register_account');
    const password = getFieldValue('register_password1');
    const result = await this.props.dispatch({
      type: 'auth/toRegister',
      payload: {
        account,
        password,
      }
    });
    setTimeout(() => {
      if (result && result.data.success) {
        message.success(result.data.msg);
        this.Register.current.resetFields();
      } else {
        message.error(result.data.msg);
      }
      this.setState({
        loading: false,
      });
    }, 500);
  }

  render() {
    const {
      tabKey,
      loading,
    } = this.state;
    return (
      <div className={styles.loginPage}>
          <QueueAnim
            delay={300}
            className="queue-simple">
          <div
            key="login"
            className={styles.LoginContent}>
            <Tabs
              defaultActiveKey="1"
              activeKey={tabKey}
              animated={{ inkBar: true, tabPane: true }}
              onChange={this.handleCheckoutTab}
            >
              <TabPane tab="账号登录" key="1">
              <Form
                wrapperCol={{ span: 24 }}
                ref={this.AccountRef}
                name="account-ref"
                onFinish={this.onFinishLogin}
              >
                <Form.Item name="account" rules={[{ required: true, message: '账号不能为空' }]}>
                  <Input placeholder="请输入账号"/>
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: '密码不能为空' }]}>
                  <Input.Password
                    placeholder="请输入密码"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.loginBt}
                    loading={loading}
                  >登录</Button>
                </Form.Item>
                <Form.Item>
                  <a onClick={this.handleCheckoutTab.bind(this, 3)}>还没有账号，去注册</a>
                </Form.Item>
              </Form>
              </TabPane>
              {/* <TabPane tab="手机号登录" key="2">
              <Form
                wrapperCol={{ span: 24 }}
                ref={this.PhoneLoginRef}
                name="phone-ref"
                onFinish={this.onFinish}
              >
                <Form.Item className={styles.phoneInput} name="phone" rules={[{ required: true, message: '手机号不能为空' }]}>
                  <Input placeholder="请输入手机号"/>
                  <a className={styles.getCode}>获取验证码</a>
                </Form.Item>
                <Form.Item name="code" rules={[
                  { required: true, message: '验证码不能为空' },
                  { whitespace: true, message: '不能输入空格' },
                ]}>
                  <Input
                    placeholder="请输入验证码"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    className={styles.loginBt}
                  >登录</Button>
                </Form.Item>
              </Form>
              </TabPane> */}
              <TabPane tab="账号注册" key="3">
              <Form
                wrapperCol={{ span: 24 }}
                ref={this.Register}
                name="register-ref"
                onFinish={this.handleRegister}
              >
                <Form.Item name="register_account"
                  rules={[
                    { required: true, message: '账号不能为空' },
                    { whitespace: true, message: '不能输入空格' },
                    { validator: this.LengthValidator },
                  ]}
                >
                  <Input maxLength="16" placeholder="请输入账号"/>
                </Form.Item>
                <Form.Item name="register_password1" rules={[
                    { required: true, message: '密码不能为空' },
                    { whitespace: true, message: '不能输入空格' },
                    { validator: this.LengthValidator },
                  ]}>
                  <Input.Password
                    maxLength="16"
                    placeholder="请输入密码"
                  />
                </Form.Item>
                <Form.Item name="register_password2" rules={[
                  { required: true, message: '密码不能为空' },
                  { whitespace: true, message: '不能输入空格' },
                  { validator: this.passwordValidator }
                ]}>
                  <Input.Password
                    maxLength="16"
                    placeholder="请再次输入密码"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.loginBt}
                    loading={loading}
                  >注册</Button>
                </Form.Item>
                <Form.Item>
                  <a onClick={this.handleCheckoutTab.bind(this, 1)}>已有账号，去登录</a>
                </Form.Item>
              </Form>
              </TabPane>
            </Tabs>
          </div>
        </QueueAnim>
      </div>
    );
  }
}

LoginPage.propTypes = {
};

export default connect()(LoginPage);
