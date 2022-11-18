import { useRef } from "react";

import Tweet from "./Tweet";
import { Company as ICompany } from '../types/company';
import { Tweet as ITweet } from '../types/tweet';

import styles from "./TwoTweets.module.scss";


const OldTweets = ({
    company,
    tweet1,
    tweet2,
}: {
    company: ICompany;
    tweet1: ITweet;
    tweet2: ITweet;
}) => {
    const nullRef = useRef<HTMLDivElement | null>(null);

    return (
        <div>
            <div className={styles.pair + " " + styles.oldPair}>
                <Tweet
                    company={company}
                    tweet={tweet1}
                    tweetRef={nullRef}
                    checkmarkPosition={nullRef}
                    hover={false}
                />
                <Tweet
                    company={company}
                    tweet={tweet2}
                    tweetRef={nullRef}
                    checkmarkPosition={nullRef}
                    hover={false}
                />
            </div>
        </div>
    );
};

export default OldTweets;
