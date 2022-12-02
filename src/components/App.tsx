import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import styles from "./App.module.scss";
import Game from "./Game";
import GameOver from "./GameOver";
import Landing from "./Landing";
import Leaderboard from "./Leaderboard";

const App = () => {
    const search = useLocation().search;
    const useOriginalRelease = new URLSearchParams(search).get("useOriginalRelease");

    const [gameState, setGameState] = useState<"START" | "GAMEPLAY" | "GAMEOVER" | "END">(
        "START"
    );
    const [originalRelease, setOriginalRelease] = useState<boolean>(false);
    const [twitterHandle, setTwitterHandle] = useState<string>('');

    useEffect(() => {
        if (useOriginalRelease === 'true') {
            setOriginalRelease(true);
        }
    }, []);

    return (
        <div className={styles.page}>
            {
                originalRelease
                ? <div className={styles.banner}>TWITTER INTERNAL</div>
                : null
            }

            {gameState === "START" ? (
                <Landing
                    originalRelease={originalRelease}
                    start={() => setGameState("GAMEPLAY")}
                    twitterHandle={twitterHandle}
                    setTwitterHandle={setTwitterHandle}
                />
            ) : gameState === "GAMEPLAY" ? (
                <Game
                    end={() => setGameState("GAMEOVER")}
                    originalRelease={originalRelease}
                    twitterHandle={twitterHandle}
                />
            ) : gameState === "GAMEOVER" ? (
                <GameOver
                    originalRelease={originalRelease}
                    proceed={() => setGameState("END")}
                />
            ) : (
                <Leaderboard restart={() => setGameState("START")} />
            )}
        </div>
    );
};

export default App;
