import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

function GoodsCenter() {

  return (
    <div>
      商品列表
    </div>
  );
}

GoodsCenter.propTypes = {
};

export default connect()(GoodsCenter);
