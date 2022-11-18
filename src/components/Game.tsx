import { useEffect, useRef, useState, useCallback } from "react";

import Progress from "./Progress";
import TwoTweets from "./TwoTweets";
import Checkmark from "./Checkmark";
import Score from "./Score";
import { Tweet as ITweet } from "../types/tweet";
import { Company as ICompany } from "../types/company";
import OldTweets from "./OldTweets";
import Lives, { MAX_LIFE } from "./Lives";
import { getQuestion, submitResponse } from "../api";

import styles from "./Game.module.scss";
import Warning from "./Warning";

const T_HISTORY: string[] = [];
const HISTORY_SIZE = 30;

const Game = ({
    end,
    twitterHandle,
}: {
    end(): void;
    twitterHandle: string;
}) => {
    const networkState = useRef<number>(0);

    const [selectedTweet, setSelectedTweet] = useState<0 | 1 | 2>(0);
    const [correctTweet, setCorrectTweet] = useState<0 | 1 | 2>(0);
    const [disabled, setDisabled] = useState<boolean>(false);

    const [tweet1, setTweet1] = useState<ITweet | null>(null);
    const [tweet2, setTweet2] = useState<ITweet | null>(null);
    const [oldTweet1, setOldTweet1] = useState<ITweet | null>(null);
    const [oldTweet2, setOldTweet2] = useState<ITweet | null>(null);
    const [company, setCompany] = useState<ICompany | null>(null);
    const [oldCompany, setOldCompany] = useState<ICompany | null>(null);
    const [warningVisible, setWarningVisible] = useState<boolean>(false);

    const spaceRef = useRef<HTMLDivElement | null>(null);
    const tweet1Ref = useRef<HTMLElement | null>(null);
    const tweet2Ref = useRef<HTMLElement | null>(null);
    const tweet1CMRef = useRef<HTMLElement | null>(null);
    const tweet2CMRef = useRef<HTMLElement | null>(null);

    const [t1ClientRect, setT1ClientRect] = useState<null | DOMRect>(null);
    const [t2ClientRect, setT2ClientRect] = useState<null | DOMRect>(null);

    useEffect(() => {
        let alive = true;
        let cT1: DOMRect | null = null;
        let cT2: DOMRect | null = null;

        const setRects = () => {
            if (tweet1Ref.current) {
                const t1 = tweet1Ref.current.getBoundingClientRect();
                if (
                    !cT1 ||
                    t1.left !== cT1.left ||
                    t1.right !== cT1.right ||
                    t1.top !== cT1.top ||
                    t1.bottom !== cT1.bottom
                ) {
                    cT1 = t1;
                    setT1ClientRect(t1);
                }
            }
            if (tweet2Ref.current) {
                const t2 = tweet2Ref.current.getBoundingClientRect();
                if (
                    !cT2 ||
                    t2.left !== cT2.left ||
                    t2.right !== cT2.right ||
                    t2.top !== cT2.top ||
                    t2.bottom !== cT2.bottom
                ) {
                    cT2 = t2;
                    setT2ClientRect(t2);
                }
            }
        };

        const aframe = () => {
            setRects();
            if (alive) requestAnimationFrame(aframe);
        };
        requestAnimationFrame(aframe);
        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        if (!tweet1 && !networkState.current) getTweetsFromServer();
    }, [tweet1]);

    const [progress, setProgress] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(MAX_LIFE);
    const onDrop = useCallback(
        async (selected: 1 | 2) => {
            if (!company || !tweet1 || !tweet2) return;

            const correct: 1 | 2 = (await submitResponse(
                company.company_id,
                selected === 1 ? tweet1.tweet_id : tweet2.tweet_id
            ))
                ? selected
                : ((3 - selected) as 1 | 2);
            setCorrectTweet(correct);
            setDisabled(true);
            let canContinue = true;

            if (correct === selected) {
                fetch(`${process.env.REACT_APP_SERVER_URL}/responses`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ response: [
                        {
                            company_id: company.company_id,
                            tweet_id: tweet1.tweet_id,
                            action: selected === 1 ? 'CORRECTLY_MARKED_REAL' : 'CORRECTLY_MARKED_FAKE',
                            twitterHandle,
                        },
                        {
                            company_id: company.company_id,
                            tweet_id: tweet2.tweet_id,
                            action: selected === 2 ? 'CORRECTLY_MARKED_REAL' : 'CORRECTLY_MARKED_FAKE',
                            twitterHandle,
                        }
                    ]}),
                });
                setProgress((oldProg) => {
                    const challengesInLevel = Math.min(
                        10,
                        2 * (Math.floor(oldProg) + 1)
                    );
                    const newProg =
                        Math.round((oldProg + 1 / challengesInLevel) * 1000) /
                        1000;
                    return newProg;
                });
                setScore((oldScore) => oldScore + 8);
            } else {
                fetch(`${process.env.REACT_APP_SERVER_URL}/responses`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ response: [
                        {
                            company_id: company.company_id,
                            tweet_id: tweet1.tweet_id,
                            action: selected === 1 ? 'INCORRECTLY_MARKED_REAL' : 'INCORRECTLY_MARKED_FAKE',
                            twitterHandle,
                        },
                        {
                            company_id: company.company_id,
                            tweet_id: tweet2.tweet_id,
                            action: selected === 2 ? 'INCORRECTLY_MARKED_REAL' : 'INCORRECTLY_MARKED_FAKE',
                            twitterHandle,
                        }
                    ]}),
                });
                setLives((old) => {
                    if (old === 1) {
                        canContinue = false;
                        if (networkState.current === 2)
                            setTimeout(() => {
                                fetch(
                                    process.env.REACT_APP_SERVER_URL +
                                        "/leaderboard/submit_entry",
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            twitter_handle: twitterHandle,
                                            score,
                                            level: Math.floor(progress),
                                        }),
                                    }
                                ).then(() => {
                                    networkState.current = 0;
                                });
                                end();
                            }, 1500);
                        networkState.current = 1;
                        return old;
                    } else return Math.max(0, old - 1);
                });
                if (Math.random() <= 0.1) {
                    setWarningVisible(true);
                    setTimeout(() => {
                        setWarningVisible(false);
                    }, 3000);
                }
            }

            if (canContinue)
                setTimeout(() => {
                    setCorrectTweet(0);
                    setDisabled(false);
                    getTweetsFromServer();
                }, 1500);
        },
        [company, tweet1, tweet2, end, twitterHandle, score]
    );

    const getTweetsFromServer = async () => {
        networkState.current = 1;

        const resp = await getQuestion(T_HISTORY);

        setCompany((oldC) => {
            setOldCompany(oldC);
            return {
                company_id: resp.company_id,
                name: resp.name,
                handle: resp.handle,
                picture: resp.picture,
                followers: resp.followers,
                following: resp.following,
                joined_date: resp.joined_date,
            };
        });

        setTweet1((oldT1) => {
            setOldTweet1(oldT1);
            return {
                attachment: resp.tweets[0].attachment,
                body: resp.tweets[0].body,
                date: new Date(resp.tweets[0].date),
                interactions: {
                    likes: resp.tweets[0].likes,
                    replies: resp.tweets[0].replies,
                    quote_tweets: resp.tweets[0].quote_tweets,
                    retweets: resp.tweets[0].retweets,
                },
                tweet_id: resp.tweets[0].id_num,
                vibe: resp.tweets[0].vibe,
            };
        });

        setTweet2((oldT2) => {
            setOldTweet2(oldT2);
            return {
                attachment: resp.tweets[1].attachment,
                body: resp.tweets[1].body,
                date: new Date(resp.tweets[1].date),
                interactions: {
                    likes: resp.tweets[1].likes,
                    replies: resp.tweets[1].replies,
                    quote_tweets: resp.tweets[1].quote_tweets,
                    retweets: resp.tweets[1].retweets,
                },
                tweet_id: resp.tweets[1].id_num,
                vibe: resp.tweets[1].vibe,
            };
        });

        T_HISTORY.push(resp.tweets[0].id_num);
        T_HISTORY.push(resp.tweets[1].id_num);
        while (T_HISTORY.length > HISTORY_SIZE) T_HISTORY.shift();

        networkState.current = 2;
    };

    return (
        <>
            {tweet1 && tweet2 && company ? (
                <Checkmark
                    tweet1ID={tweet1.tweet_id}
                    setSelected={setSelectedTweet}
                    t1ClientRect={t1ClientRect}
                    t2ClientRect={t2ClientRect}
                    tweet1CMRef={tweet1CMRef}
                    tweet2CMRef={tweet2CMRef}
                    spaceRef={spaceRef}
                    onDrop={onDrop}
                    disabled={disabled || lives === 0}
                    correctAnswer={correctTweet}
                />
            ) : null}

            <Lives life={lives} />
            <Score score={score} />
            <div className={styles.handle}>@{twitterHandle}</div>

            {tweet1 && tweet2 && company ? (
                <TwoTweets
                    company={company}
                    tweet1={tweet1}
                    tweet2={tweet2}
                    selectedTweet={selectedTweet}
                    tweet1Ref={tweet1Ref}
                    tweet2Ref={tweet2Ref}
                    tweet1CMRef={tweet1CMRef}
                    tweet2CMRef={tweet2CMRef}
                />
            ) : null}
            {oldCompany && oldTweet1 && oldTweet2 ? (
                <OldTweets
                    key={
                        oldTweet1.tweet_id +
                        oldTweet2.tweet_id +
                        oldCompany.company_id
                    }
                    company={oldCompany}
                    tweet1={oldTweet1}
                    tweet2={oldTweet2}
                />
            ) : null}
            <div ref={spaceRef} style={{ flexGrow: 1 }} />
            <Progress level={Math.floor(progress)} progress={progress % 1} />
            <Warning visible={warningVisible} />
        </>
    );
};

export default Game;
