import { Like, LikeFilled } from "./Icons";

import styles from "./Lives.module.scss";

export const MAX_LIFE = 4;
const Lives = ({ life }: { life: number }) => {
    return (
        <div className={styles.wrap}>
            <div className={styles.lives}>
                {new Array(life).fill(null).map((x, n) => (
                    <LikeFilled className={styles.life} key={n} />
                ))}
                {new Array(MAX_LIFE - life).fill(null).map((x, n) => (
                    <Like
                        className={styles.life + " " + styles.lost}
                        key={life + n}
                    />
                ))}
            </div>
        </div>
    );
};
export default Lives;
