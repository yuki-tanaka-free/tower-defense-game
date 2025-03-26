import { JSX } from "react";
import { GameManager } from "../../game/core/GameManager";
import { GameLifecycleState } from "../../game/core/GamelifecycleState";
import "../../css/uis/GameControlRenderer.css"

interface GameControlRendererProps {
    gameState: GameLifecycleState;
    onRestart: () => void;
}

export function GameControlRenderer({ gameState, onRestart }: GameControlRendererProps): JSX.Element {
    const gameManager = GameManager.getInstance();

    const handleStartGame = () => {
        gameManager.start();
    }

    const handleTogglePause = () => {
        gameManager.togglePause();
    }

    const isStarted = gameState !== GameLifecycleState.NotStarted;
    const isPaused = gameState === GameLifecycleState.Paused;

    return (
        <div className="game-control-renderer">
            {!isStarted && (
                <button onClick={handleStartGame}>ゲーム開始</button>
            )}
            {isStarted && (
                <>
                    <button onClick={handleTogglePause}>
                        {isPaused ? "再開" : "一時停止"}
                    </button>
                    <button onClick={onRestart}>リスタート</button>
                </>
            )}
        </div>
    );
}