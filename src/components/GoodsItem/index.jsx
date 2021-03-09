import * as styles from './index.less';

function GoodsItem(props) {

    const { ItemData } = props;
    return (
        <div className={styles.ItemDiv}>
            <a>
                <div className={styles.aItemDiv}>
                    <div style={{ overflow: 'hidden' }}>
                        <img src={ItemData.good_img_src} alt="照片" className={styles.ItemImg}/>
                    </div>
                    <div className={styles.ItemBottom}>
                        <div className={styles.ItemName}>{ItemData.good_name}</div>
                        <div className={styles.timeAndbrose}>
                            <span>发布于2020-05-09</span>
                            <span>{ItemData.good_browse}人浏览</span>
                        </div>
                        <div className={styles.ItemProduce}>{ItemData.good_produce}</div>
                        <div className={styles.ItemPriceAndSchool}>
                            <span className={styles.ItemPrice}>￥{ItemData.good_out_price}</span>
                            <span className={styles.ItemSchool}>杭州师范大学</span>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    )
}

export default GoodsItem;