import React from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

const Error = () => (
  <div className={styles.exceptionContent}>
    <div className={styles.prompt}>
      <h3 className={styles.title}>
        抱歉，你访问的页面不存在
      </h3>
      <p className={styles.description}>
        您要找的页面没有找到，请返回<Link to='/'>首页</Link>继续浏览
      </p>
    </div>
  </div>
);

export default Error;
