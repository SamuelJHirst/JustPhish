export type Tweet = {
    attachment: string | null;
    body: string;
    date: Date;
    interactions: {
        likes: number;
        replies: number;
        quote_tweets: number;
        retweets: number;
    };
    tweet_id: string;
    vibe: string | null;
};
