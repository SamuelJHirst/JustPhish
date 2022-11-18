import { useEffect, useState } from 'react';
import styles from './Leaderboard.module.scss';

interface LeaderboardProps {
    restart(): void;
}

interface LeaderboardEntry {
    twitter_handle: string;
    score: number;
    level: number;
}

function Leaderboard(props: LeaderboardProps) {
    const { restart } = props;

    const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        fetch(process.env.REACT_APP_SERVER_URL + "/leaderboard").then(async (x) =>
            setLeaderboardEntries((await x.json()).leaderboard)
        );
    }, []);

    if (leaderboardEntries.length === 0) {
        return null;
    }

    return (
        <div className={styles.leaderboardWrapper}>
            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Level</th>
                            <th>Money Spent on Twitter Blue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            leaderboardEntries.map((x: LeaderboardEntry, i: number) => (
                                <tr>
                                    <td><strong>{i + 1}</strong></td>
                                    <td>{x.twitter_handle ? `@${x.twitter_handle}` : "-"}</td>
                                    <td>{x.level ? x.level : '-'}</td>
                                    <td>{x.score ? `$${x.score}` : "-"}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <button
                className={styles.goButton}
                onClick={restart}
            >
                Play Again
            </button>
        </div>
    );
}

export default Leaderboard;