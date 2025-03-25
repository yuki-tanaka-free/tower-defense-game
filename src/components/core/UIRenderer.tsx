import { memo, JSX, useState } from "react";
import { WaveControlRenderer } from "../uis/WaveControlRenderer";
import { TowerPaletteRenderer } from "../uis/TowerPaletteRenderer";
import { GameControlRenderer } from "../uis/GameControlRenderer";
import { GameManager } from "../../game/core/GameManager";
import "../../css/core/UIRenderer.css"

function UIRenderer(): JSX.Element {
    const [restartKey, setRestartKey] = useState(0);

    const handleRestart = async () => {
        await GameManager.getInstance().restart();
        setRestartKey(prev => prev + 1);
    }
    return (
        <div className="ui-renderer">
            <WaveControlRenderer key={"Wave" + restartKey} />
            <GameControlRenderer key={"Game" + restartKey} onRestart={handleRestart}/>
            <TowerPaletteRenderer />
        </div>
    )
};

export const MemoizedUIRenderer = memo(UIRenderer);