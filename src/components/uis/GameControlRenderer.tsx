import { JSX, useEffect, useState } from "react";
import { GameManager } from "../../game/core/GameManager";
import { GameLifecycleState } from "../../game/core/GamelifecycleState";
import "../../css/uis/GameControlRenderer.css"

interface Props {
    onRestart: () => void;
}

export function GameControlRenderer({ onRestart }: Props): JSX.Element {
    const gameManager = GameManager.getInstance();
    
    const [lifecycleState, setLifecycleState] = useState(gameManager.getLifecycleState());

    useEffect(() => {
        const handleGameStateChange = (state: GameLifecycleState) => {
            setLifecycleState(state);
        }

        gameManager.addGameStateChanged(handleGameStateChange);
        return () => gameManager.removeGameStateChanged(handleGameStateChange);
    }, []);

    const handleStartGame = () => {
        gameManager.start();
    }

    const handleTogglePause = () => {
        gameManager.togglePause();
    }

    const isStarted = lifecycleState !== GameLifecycleState.NotStarted;
    const isPaused = lifecycleState === GameLifecycleState.Paused;

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