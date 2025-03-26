import { TowerType } from "../../game/entities/tower/TowerType";
import { TowerEntity } from "../../game/entities/tower/TowerEntity";
import { TowerSelector } from "../../game/entities/tower/TowerSelector";
import { GameManager } from "../../game/core/GameManager";
import { JSX, useEffect, useState } from "react";
import { WaveState } from "../../game/wave/WaveState";
import { GameLifecycleState } from "../../game/core/GamelifecycleState";

interface TowerControlRendererProps {
    gameState: GameLifecycleState;
    tower: TowerEntity;
}

export function TowerControlRenderer({ gameState, tower }: TowerControlRendererProps): JSX.Element | null {
    const gameManager = GameManager.getInstance();
    const waveManager = gameManager.waveManager;
    const towerSelector = TowerSelector.getInstance();
    const player = GameManager.getInstance().player;
    
    const [waveState, setWaveState] = useState(waveManager?.getWaveState());

    useEffect(() => {
        if (!waveManager) return;

        setWaveState(waveManager.getWaveState());
        
        waveManager.addWaveStateChanged(setWaveState);

        return () => {
            waveManager.removeWaveStateChanged(setWaveState);
        }
    }, [waveManager]);

    useEffect(() => {
        if (gameState === GameLifecycleState.Restarting) {
            handleClose();
        }
    }, [gameState]);

    const handleUpgrade = () => {
        if (player?.buying(tower.upgradeAmount)) {
            tower.upgrade();
            handleClose();
        } else {
            alert("所持金が足りません。");
        }
    }

    const handleSell = () => {
        player?.addMoney(tower.sellAmount);
        GameManager.getInstance().entitiesManager?.removeEntity(tower);
        handleClose();
    }

    const handleClose = () => {
        towerSelector.selectedTower = null;
    }

    if (!waveManager || waveState !== WaveState.Preparing) {
        return null;
    }

    return (
        <div className="tower-control-renderer">
            <h3>Tower Info</h3>
            <p>Type: {TowerType[tower.towerType]}</p>
            <p>Level: {tower.level}</p>
            {tower.upgradeAmount > -1 && <button onClick={handleUpgrade}>Upgrade:${tower.upgradeAmount}</button>}
            {tower.sellAmount > -1 && <button onClick={handleSell}>Sell:${tower.sellAmount}</button>}
            <button onClick={handleClose}>Close</button>
        </div>
    );
}