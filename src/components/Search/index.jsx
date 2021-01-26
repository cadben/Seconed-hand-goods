import React from 'react';
import * as styles from './index.less';

class MSearch extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  onHandleSearch = (keyword) => {
    const { onMyClick } = this.props;
    if (!keyword) return;
    onMyClick(keyword);
  }

  render() {
    const {
      keyword,
      onChange,
    } = this.props;
    return(
      <div className={styles.SearchDiv}>
        <img src="https://cdn.jsdelivr.net/gh/cadben/images_store@master/img/fxxj3ttftm5ltcqnto1o4baovyl.png" className={styles.SearchLogo}/>
        <input 
          className={styles.MInput}
          placeholder="输入商品关键词"
          value={keyword}
          onChange={(e) => onChange(e.target.value)}
        />
        <div
          className={styles.MButton}
          onClick={this.onHandleSearch.bind(this, keyword)}
        >搜索</div>
      </div>
    )
  }
}

export default MSearch;
