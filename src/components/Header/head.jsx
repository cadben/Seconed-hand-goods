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
  const MyChilds = (
    <Menu>
      <MenuItem>
        <Link to='/app/my?status=1'>收货地址</Link>
      </MenuItem>
    </Menu>
  )

  const { Auth } = props;
  const { user } = Auth;
  return (
    <Header>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/app">首页</Link>
          {
            <span className={styles.login_tip}>你好
              {
                !(user && user.user_nick) ? <Link to="/app/login" style={{ textDecoration: 'underline' }}>  请登陆</Link> :
                <Link to="/app/my" style={{ textDecoration: 'underline' }}>  {user.user_nick}</Link>
              }
            </span>
          }
        </div>
        <div className={styles.headerRight}>
          {
            LinkItems.map((item) => {
              if (!item.childrens) {
                return (<Link key={Math.random() * 10000} to={item.path}>{item.title}</Link>)
              } else {
                return (<Dropdown key={Math.random() * 10000} className="ant-dropdown-link" overlay={MyChilds} placement="bottomRight">
                  <Link to={item.path}>{item.title} <DownOutlined /></Link>
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
