import "../../css/uis/GameEnd.css"

interface GameClearRendererProps {
    onRestart: () => void;
}

export function GameClearRenderer({ onRestart }: GameClearRendererProps) {
    return (
        <div className="game-end-overlay">
            <h1 className="game-end-text">Game Clear!</h1>
            <button className="game-end-button" onClick={onRestart}>もう一度遊ぶ</button>
        </div>
    );
}