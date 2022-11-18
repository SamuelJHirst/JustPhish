import Tweet from "./Tweet";
import { Company as ICompany } from '../types/company';
import { Tweet as ITweet } from '../types/tweet';

import styles from "./TwoTweets.module.scss";

const TwoTweets = ({
    selectedTweet,
    company,
    tweet1,
    tweet2,
    tweet1Ref,
    tweet2Ref,
    tweet1CMRef,
    tweet2CMRef,
}: {
    selectedTweet: number;
    company: ICompany;
    tweet1: ITweet;
    tweet2: ITweet;
    tweet1Ref: React.MutableRefObject<any>,
    tweet2Ref: React.MutableRefObject<any>,
    tweet1CMRef: React.MutableRefObject<any>;
    tweet2CMRef: React.MutableRefObject<any>;
}) => {
    return (
        <div>
            <div className={styles.pair}>
                <Tweet
                    company={company}
                    tweet={tweet1}
                    tweetRef={tweet1Ref}
                    checkmarkPosition={tweet1CMRef}
                    hover={selectedTweet === 1}
                />
                <Tweet
                    company={company}
                    tweet={tweet2}
                    tweetRef={tweet2Ref}
                    checkmarkPosition={tweet2CMRef}
                    hover={selectedTweet === 2}
                />
            </div>
            <div className={styles.cta}>Verify the correct account</div>
        </div>
    );
};

export default TwoTweets;
