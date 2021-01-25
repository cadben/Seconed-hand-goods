import React from 'react';
import { connect } from 'dva';
import { Dropdown, Layout, Menu } from 'antd';
import * as styles from './head.less';
import { Link, withRouter } from 'dva/router';
import MenuItem from 'antd/lib/menu/MenuItem';
import { DownOutlined } from '@ant-design/icons';

const { Header } = Layout;


function MHeader() {
  const LinkItems = [
    {
      title: '购物车',
      path: '/app/my/shopcar',
    },
    {
      title: '我的订单',
      path: '/app/my/orders',
    },
    {
      title: '我的',
      path: '/app/my',
      childrens: true,
    },
  ]
  const MyChilds = (
    <Menu>
      <MenuItem>
        <Link to='/app/my/favorite'>个人收藏</Link>
      </MenuItem>
    </Menu>
  )
  return (
    <Header>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/app">首页</Link>
        </div>
        <div className={styles.headerRight}>
          {
            LinkItems.map((item, index) => {
              if (!item.childrens) {
                return (<Link to={item.path}>{item.title}</Link>)
              } else {
                return (<Dropdown className="ant-dropdown-link" overlay={MyChilds} placement="bottomRight">
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
