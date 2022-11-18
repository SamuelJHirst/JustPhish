import { useState } from "react";
import styles from "./App.module.scss";
import Game from "./Game";
import GameOver from "./GameOver";
import Landing from "./Landing";
import Leaderboard from "./Leaderboard";

const App = () => {
    const [gameState, setGameState] = useState<"START" | "GAMEPLAY" | "GAMEOVER" | "END">(
        "START"
    );
    const [twitterHandle, setTwitterHandle] = useState<string>('');

    return (
        <div className={styles.page}>
            <div className={styles.banner}>TWITTER INTERNAL</div>

            {gameState === "START" ? (
                <Landing
                    start={() => setGameState("GAMEPLAY")}
                    twitterHandle={twitterHandle}
                    setTwitterHandle={setTwitterHandle}
                />
            ) : gameState === "GAMEPLAY" ? (
                <Game
                    end={() => setGameState("GAMEOVER")}
                    twitterHandle={twitterHandle}
                />
            ) : gameState === "GAMEOVER" ? (
                <GameOver proceed={() => setGameState("END")} />
            ) : (
                <Leaderboard restart={() => setGameState("START")} />
            )}
        </div>
    );
};

export default App;
