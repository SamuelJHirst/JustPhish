import { useEffect, useState } from "react";
import Email from "./Email";
import styles from "./Landing.module.scss";

interface LandingProps {
    start(): void;
    twitterHandle: string;
    setTwitterHandle(twitterHandle: string): void;
}

let emailHiddenEver = false;
let imageFlip = Math.random() < 0.1;

function Landing(props: LandingProps) {
    const { start, twitterHandle, setTwitterHandle } = props;

    const [emailVisible, setEmailVisible] = useState<boolean>(!emailHiddenEver);
    const [emailHidden, setEmailHidden] = useState<boolean>(false);

    const sth = (value: string) => {
        setTwitterHandle(value.replaceAll("@", "").substring(0, 32));
    };

    if (!emailVisible && !emailHidden) {
        setTimeout(() => {
            emailHiddenEver = true;
            setEmailHidden(true);
        }, 1000);
    }

    return (
        <>
            <div className={styles.landingWrapper}>
                <img
                    alt="JustPhish Logo"
                    className={styles.logo}
                    src="/photo-white-512.png"
                    style={{
                        transform: imageFlip ? 'scaleX(-1)' : 'none',
                    }}
                />
                <h1 className={styles.welcomeText}>Welcome to {process.env.REACT_APP_NAME}*</h1>
                <sub>* Final name TBC!</sub>
                <br />
                <div className={styles.twitterHandleWrapper}>
                    <span className={styles.twitterHandlePrefix}>@</span>
                    <input
                        className={styles.twitterHandleInput}
                        onChange={(e) => {
                            sth(e.target.value);
                        }}
                        placeholder="Choose a Handle"
                        value={twitterHandle}
                        onKeyDown={(e) => {
                            if (e.code === "Enter") {
                                if (twitterHandle !== "") start();
                            }
                        }}
                        autoFocus
                    />
                </div>
                <button
                    className={styles.goButton}
                    disabled={!twitterHandle}
                    onClick={() => {
                        if (twitterHandle !== "") start();
                    }}
                    style={{
                        cursor: twitterHandle ? "pointer" : "default",
                    }}
                >
                    Start Game
                </button>
            </div>
            {emailHidden || emailHiddenEver ? null : (
                <Email
                    close={() => setEmailVisible(false)}
                    visible={emailVisible}
                />
            )}
        </>
    );
}

export default Landing;
