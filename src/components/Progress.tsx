import { memo } from "react";

import styles from "./Progress.module.scss";

const Progress = ({ level, progress }: { level: number, progress: number }) => {
    return (
        <div
            className={styles.progress}
            style={{ "--progress": progress } as React.CSSProperties}
        >
            <div className={styles.label}>Level {level} - {Math.round(progress * 100)}%</div>
        </div>
    );
};
export default memo(Progress);
