import { memo, JSX, useState } from "react";
import { WaveControlRenderer } from "../uis/WaveControlRenderer";
import { TowerPaletteRenderer } from "../uis/TowerPaletteRenderer";
import { GameControlRenderer } from "../uis/GameControlRenderer";
import { GameManager } from "../../game/core/GameManager";
import "../../css/core/UIRenderer.css"
import { GameStatusRenderer } from "../uis/GameStatusRenderer";

function UIRenderer(): JSX.Element {
    const [restartKey, setRestartKey] = useState(0);

    const handleRestart = async () => {
        await GameManager.getInstance().restart();
        setRestartKey(prev => prev + 1);
    }
    return (
        <div className="ui-renderer">
            <WaveControlRenderer key={"Wave" + restartKey} />
            <GameControlRenderer key={"GameControl" + restartKey} onRestart={handleRestart}/>
            <GameStatusRenderer key={"GameState" + restartKey}/>
            <TowerPaletteRenderer />
        </div>
    )
};

export const MemoizedUIRenderer = memo(UIRenderer);