import "../../css/uis/GameEnd.css"

interface GameOverRendererProps {
    onRestart: () => void;
}

export function GameOverRenderer({ onRestart }: GameOverRendererProps) {
    return (
        <div className="game-end-overlay">
            <h1 className="game-end-text">Game Over</h1>
            <button className="game-end-button" onClick={onRestart}>リスタート</button>
        </div>
    );
}