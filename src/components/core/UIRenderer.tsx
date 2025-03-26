import { memo, JSX, useState, useEffect } from "react";
import { WaveControlRenderer } from "../uis/WaveControlRenderer";
import { TowerPaletteRenderer } from "../uis/TowerPaletteRenderer";
import { GameControlRenderer } from "../uis/GameControlRenderer";
import { GameManager } from "../../game/core/GameManager";
import { GameStatusRenderer } from "../uis/GameStatusRenderer";
import { TowerSelector } from "../../game/entities/tower/TowerSelector";
import { TowerControlRenderer } from "../uis/TowerControlRenderer";
import { TowerEntity } from "../../game/entities/tower/TowerEntity";
import { GameLifecycleState } from "../../game/core/GamelifecycleState";
import { GameOverRenderer } from "../uis/GameOverRenderer";
import { GameClearRenderer } from "../uis/GameClearRenderer";
import "../../css/core/UIRenderer.css"

interface UIRendererProps {
    gameState: GameLifecycleState
}

function UIRenderer({ gameState }: UIRendererProps): JSX.Element {
    const gameManager = GameManager.getInstance();
    const [restartKey, setRestartKey] = useState(0);
    const [selectedTower, setSelectedTower] = useState<TowerEntity | null>(
        TowerSelector.getInstance().selectedTower
    );

    useEffect(() => {
        const update = () => {
            setSelectedTower(TowerSelector.getInstance().selectedTower);
        };

        const selector = TowerSelector.getInstance();
        selector.addListener(update);
        
        return () => {
            selector.removeListener(update);
        }
    }, []);

    const handleRestart = async () => {
        await gameManager.restart();
        setRestartKey(prev => prev + 1);
    }

    return (
        <div className="ui-renderer">
            <WaveControlRenderer key={"Wave" + restartKey} gameState={gameState}/>
            <GameControlRenderer key={"GameControl" + restartKey} onRestart={handleRestart} gameState={gameState} />
            <GameStatusRenderer key={"GameState" + restartKey} gameState={gameState} />
            <TowerPaletteRenderer gameState={gameState}/>
            {selectedTower && (<TowerControlRenderer tower={selectedTower} gameState={gameState}/>)}
            {gameState === GameLifecycleState.GameOver && (
                <GameOverRenderer onRestart={handleRestart} />
            )}
            {gameState === GameLifecycleState.GameClear && (
                <GameClearRenderer onRestart={handleRestart} />
            )}
        </div>
    )
};

export const MemoizedUIRenderer = memo(UIRenderer);