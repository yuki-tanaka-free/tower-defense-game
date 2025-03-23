import React, { useEffect, useState } from "react";
import { EntitiesRenderer } from "./EntitiesRenderer";
import { MapRenderer } from "./MapRenderer";
import { GameManager } from "../../game/core/GameManager";
import { GameState } from "../../game/core/GameState";
import { UIRenderer } from "./UIRenderer";
import "../../css/core/GameRenderer.css"

export const GameRenderer: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        enemies: [],
        towers: [],
        playerBase: null,
        enemyBase: null
    });
    const [gameLoaded, setLoaded] = useState(false);

    useEffect(() => {
        const init = async () => {
            const gameManager = GameManager.getInstance();
            await gameManager.init(setGameState);
            setLoaded(true);
            // ゲームの更新開始
            gameManager.start();
        };
        // 初期化を行う
        init();

        // このコンポーネントがアンマウントされた時ゲームの更新を止める
        return () => GameManager.getInstance().stop();
    }, []);

    if (gameLoaded === false) {
        return <p>ゲームをロード中...</p>;
    }

    // MapRendererは静的な描画なので更新を走らせない
    // EntitiesRendererは動的な描画なのでgameStateを渡して更新させる
    return (
        <div className="game-renderer"
        >
            <MapRenderer />
            <EntitiesRenderer gameState={gameState} />
            <UIRenderer />
        </div>
    )
}