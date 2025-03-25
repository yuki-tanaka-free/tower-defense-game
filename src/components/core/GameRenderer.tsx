import { JSX, useEffect, useState } from "react";
import { EntitiesRenderer } from "./EntitiesRenderer";
import { MemoizedMapRenderer } from "./MapRenderer";
import { GameManager } from "../../game/core/GameManager";
import { MemoizedMapInteractionLayer } from "../map/MapInteractionLayer";
import { MemoizedUIRenderer } from "./UIRenderer";
import "../../css/core/GameRenderer.css"

export function GameRenderer(): JSX.Element {
    const [gameLoaded, setLoaded] = useState(false);

    useEffect(() => {
        const init = async () => {
            const gameManager = GameManager.getInstance();
            await gameManager.init();
            setLoaded(true);
        };
        // 初期化を行う
        init();

        // このコンポーネントがアンマウントされた時ゲームの更新を止める
        return () => GameManager.getInstance().stop();
    }, []);

    if (gameLoaded === false) {
        return <p>ゲームをロード中...</p>;
    }

    return (
        <div className="game-renderer">
            <div className="play-area">
                <MemoizedMapRenderer />
                <EntitiesRenderer />
                <MemoizedMapInteractionLayer />
            </div>
            <MemoizedUIRenderer />
        </div>
    )
}