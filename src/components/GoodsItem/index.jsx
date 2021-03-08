import * as styles from './index.less';

function GoodsItem(props) {

    // const { ItemData } = props;
    // const {
    //     id,
    //     name,
    //     time,
    //     browse,
    //     produce,
    //     price,
    //     school,
    //  } = ItemData;
    return (
        <div className={styles.ItemDiv}>
            <a>
                <div className={styles.aItemDiv}>
                    <div style={{ overflow: 'hidden' }}>
                        <img src="https://api.youzixy.com/public/uploads/attach/2020/05/09/5eb68e4492f77.png" alt="照片" className={styles.ItemImg}/>
                    </div>
                    <div className={styles.ItemBottom}>
                        <div className={styles.ItemName}>衣品天成短袖</div>
                        <div className={styles.timeAndbrose}>
                            <span>发布于2020-05-09</span>
                            <span>647人浏览</span>
                        </div>
                        <div className={styles.ItemProduce}>刚入手不刚入手不久刚入手不久刚入手不久刚入手不久刚入手不久刚入手不久刚入手不久刚入手不久刚入手不久久</div>
                        <div className={styles.ItemPriceAndSchool}>
                            <span className={styles.ItemPrice}>￥59</span>
                            <span className={styles.ItemSchool}>杭州师范大学</span>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    )
}

export default GoodsItem;