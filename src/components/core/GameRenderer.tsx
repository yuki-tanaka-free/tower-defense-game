import { JSX, useEffect, useState } from "react";
import { MemoizedEntitiesRenderer } from "./EntitiesRenderer";
import { MemoizedMapRenderer } from "./MapRenderer";
import { GameManager } from "../../game/core/GameManager";
import { GameState } from "../../game/core/GameState";
import { MemoizedMapInteractionLayer } from "../map/MapInteractionLayer";
import { MemoizedUIRenderer } from "./UIRenderer";
import "../../css/core/GameRenderer.css"

export function GameRenderer(): JSX.Element {
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

    // MemoizedMapRendererは静的な描画なので更新を走らせない
    // MemoizedEntitiesRendererは動的な描画なのでgameStateを渡して更新させる
    return (
        <div className="game-renderer">
            <div className="play-area">
                <MemoizedMapRenderer />
                <MemoizedEntitiesRenderer gameState={gameState} />
                <MemoizedMapInteractionLayer />
            </div>
            <MemoizedUIRenderer />
        </div>
    )
}