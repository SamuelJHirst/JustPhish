import styles from './Email.module.scss';

interface EmailProps {
    close(): void;
    visible: boolean;
}

function Email(props: EmailProps) {
    const { close, visible } = props;
    
    return (
        <div
            className={styles.popupWrapper + (visible ? '' : (' ' + styles.hidden)) }
        >
            <div
                className={styles.backdrop}
                onClick={close}
            />
            <div className={styles.popup}>
                <div
                    className={styles.popupClose}
                    onClick={close}
                >
                    X
                </div>
                <div className={styles.popupHeader}>
                    <p>
                        <strong>From:</strong> Elon Musk
                    </p>
                    <p>
                        <strong>To:</strong> You
                    </p>
                    <p>
                        <strong>Subject:</strong> New Starter
                    </p>
                </div>
                <br />
                <hr />
                <br />
                <div className={styles.popupBody}>
                    <p>
                        Fellow twit,  
                    </p>
                    <p>
                        Following the record-breaking relaunch of Twitter Blue, we are taking $TWTR to the moon 🌑. 
                    </p>
                    <p>
                        Sadly, the anti-free speech brigade is ruining our plans to make Twitter the de-facto public square by impersonating me and posting embarrassing messages. Until the remains of the Twitter AI team can write a script to ban these people from the face of the internet, you're employed to find the verified users from the fakes.
                    </p>
                    <p>
                        You'll be given a set of two tweets: drag the verified tick mark to the correct user. But remember, I'm losing millions of dollars a day on this website, so more layoffs are coming soon. Don't make me sack you.
                    </p>
                    <p>
                        Start Working,<br />
                        Elon Musk
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Email;