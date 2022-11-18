import { useState, useEffect, useRef } from "react";
import CheckmarkWhite from "./CheckmarkWhite";

import styles from "./Score.module.scss";

const STATE_SHOW = 0;
const STATE_NEXT = 1;
const STATE_NOSHOW = 2;

const Score = ({ score }: { score: number }) => {
    const [anim, setAnim] = useState(STATE_NOSHOW);
    useEffect(() => {
        setAnim((old) => (score !== 0 ? STATE_NEXT : old));
    }, [score]);
    useEffect(() => {
        if (anim)
            requestAnimationFrame(() =>
                setAnim(anim === STATE_NEXT ? STATE_SHOW : STATE_NOSHOW)
            );
    }, [anim]);

    const [current, setCurrent] = useState(score);
    const currentRef = useRef(score);
    useEffect(() => {
        let alive = true;
        const raf = () => {
            if (currentRef.current < score)
                setCurrent((old) => {
                    currentRef.current = old + 0.25;
                    return old + 0.25;
                });
            if (alive) requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
        return () => {
            alive = false;
        };
    }, [score]);

    return (
        <div className={styles.wrap}>
            <div className={styles.score}>
                ${current.toFixed(2)}
                <CheckmarkWhite
                    className={
                        styles.popup +
                        (anim === STATE_SHOW ? " " + styles.run : "")
                    }
                />
            </div>
        </div>
    );
};
export default Score;
