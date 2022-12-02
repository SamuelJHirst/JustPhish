export const submitResponse = (
    companyId: string,
    tweetId: string
): Promise<boolean> => {
    return fetch(process.env.REACT_APP_SERVER_URL + "/submitResponse", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            company_id: companyId,
            tweet_id: tweetId,
        }),
    })
        .then((x) => x.json())
        .then((x) => x.answer);
};

export const getQuestion = (
    history: string[]
): Promise<{
    id: string;
    name: string;
    handle: string;
    picture: string;
    followers: number;
    following: number;
    joined_date: string;
    company: string;
    tweets: {
        body: string;
        vibe: string;
        retweets: number;
        quote_tweets: number;
        replies: number;
        likes: number;
        date: string;
        attachment: string;
        id: string;
    }[];
}> => {
    return fetch(process.env.REACT_APP_SERVER_URL + "/getQuestion", {
        headers: {
            "X-History": history.join(","),
        },
    }).then((x) => x.json());
};
