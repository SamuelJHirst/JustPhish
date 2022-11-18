import styles from "./GameOver.module.scss";

const messages = [
    "Get ratio'd",
    "You got parody'd",
    "You won! (parody)",
    "I'm sorry, but Elon let you go",
    "You lost health like Lockheed Martin lost stocks",
    "Enjoy your Lockheed Martini and dead stocks",
    "You lost health like Eli Lilly lost stocks",
    "Poor performance tbh",
    "You have failed your performance review",
    "You've been fired for working at home",
];

interface GameOverProps {
    proceed(): void;
}

function GameOver(props: GameOverProps) {
    const { proceed } = props;

    const selectedMessage =
        messages[Math.floor(Math.random() * messages.length)];

    return (
        <div className={styles.gameOverWrapper}>
            <h1>Game Over!</h1>
            <h2>{selectedMessage}</h2>
            <button className={styles.goButton} onClick={proceed}>
                View Leaderboard
            </button>
        </div>
    );
}

export default GameOver;
