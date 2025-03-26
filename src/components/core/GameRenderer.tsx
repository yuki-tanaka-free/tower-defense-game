import { JSX, useEffect, useState } from "react";
import { EntitiesRenderer } from "./EntitiesRenderer";
import { MemoizedMapRenderer } from "./MapRenderer";
import { GameManager } from "../../game/core/GameManager";
import { MemoizedMapInteractionLayer } from "../map/MapInteractionLayer";
import { MemoizedUIRenderer } from "./UIRenderer";
import { GameLifecycleState } from "../../game/core/GamelifecycleState";
import "../../css/core/GameRenderer.css"

export function GameRenderer(): JSX.Element {
    const gameManager = GameManager.getInstance();
    const [gameLoaded, setLoaded] = useState(false);
    const [gameState, setGameState] = useState(gameManager.getLifecycleState());

    useEffect(() => {
        const init = async () => {
            await gameManager.init();
            setLoaded(true);
        };
        const onGameStateChanged = (state: GameLifecycleState) => {
            setGameState(state);
        }

        gameManager.addGameStateChanged(onGameStateChanged);

        // 初期化を行う
        init();

        // このコンポーネントがアンマウントされた時ゲームの更新を止める
        return () => gameManager.stop();
    }, [gameManager]);

    if (gameLoaded === false) {
        return <p>ゲームをロード中...</p>;
    }

    const isNotGameStarted = gameState === GameLifecycleState.NotStarted;

    return (
        <div className={`game-renderer ${isNotGameStarted ? "no-border" : ""}`}>
            {gameLoaded && !isNotGameStarted && (
                <div className="play-area">
                    <MemoizedMapRenderer />
                    <EntitiesRenderer />
                    <MemoizedMapInteractionLayer />
                </div>
            )}
            <MemoizedUIRenderer gameState={gameState} />
        </div>
    )
}