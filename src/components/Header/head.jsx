import React from 'react';
import { connect } from 'dva';
import { Dropdown, Layout, Menu } from 'antd';
import * as styles from './head.less';
import { Link, withRouter } from 'dva/router';
import MenuItem from 'antd/lib/menu/MenuItem';
import { DownOutlined } from '@ant-design/icons';

const { Header } = Layout;

function MHeader(props) {
  const LinkItems = [
    {
      title: '我的',
      path: '/app/my',
      childrens: true,
    },
  ]
  const to = (v, e) => {
    e.preventDefault();
    window.location.href = v;
  }

  const MyChilds = (
    <Menu>
      <MenuItem>
        <a onClick={to.bind(this, '/app/my?status=1')}>收货地址</a>
      </MenuItem>
    </Menu>
  )

  const { Auth } = props;
  const { user } = Auth;
  return (
    <Header>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <a onClick={to.bind(this, "/app")}>首页</a>
          {
            <span className={styles.login_tip}>你好
              {
                !(user && user.user_nick) ? <a onClick={to.bind(this, "/app/login")} style={{ textDecoration: 'underline' }}>  请登陆</a> :
                <a onClick={to.bind(this, "/app/my")} style={{ textDecoration: 'underline' }}>  {user.user_nick}</a>
              }
            </span>
          }
        </div>
        <div className={styles.headerRight}>
          {
            LinkItems.map((item) => {
              if (!item.childrens) {
                return (<a key={Math.random() * 10000} onClick={to.bind(this, item.path)}>{item.title}</a>)
              } else {
                return (<Dropdown key={Math.random() * 10000} className="ant-dropdown-link" overlay={MyChilds} placement="bottomRight">
                  <a onClick={to.bind(this, item.path)}>{item.title} <DownOutlined /></a>
                </Dropdown>)
              }
            })
          }
        </div>
      </div>
    </Header>
  );
}
const mapStateProps = (state) => {
  return {
    
  };
};

export default withRouter(connect(mapStateProps)(MHeader));
