import { memo, JSX, useEffect, useState } from "react";
import { TowerState } from "../../game/entities/tower/TowerState";
import { EntityRenderer } from "./EntityRenderer";
import { TowerType } from "../../game/entities/tower/TowerType";
import { TowerSelector } from "../../game/entities/tower/TowerSelector";
import { GameManager } from "../../game/core/GameManager";
import { TowerEntity } from "../../game/entities/tower/TowerEntity";
import { WaveState } from "../../game/wave/WaveState";

interface TowerRendererProps {
    state: TowerState;
}

/**
 * タワー描画コンポーネント
 * @param param0 
 * @returns 
 */
function TowerRenderer({ state }: TowerRendererProps): JSX.Element {
    const towerSelector = TowerSelector.getInstance();
    const gameManager = GameManager.getInstance();
    const entitiesManager = gameManager.entitiesManager;
    const waveManager = gameManager.waveManager;

    const [waveState, setWaveState] = useState(waveManager?.getWaveState());

    useEffect(() => {
        if(!waveManager) return;
        setWaveState(waveManager.getWaveState());

        waveManager.addWaveStateChanged(setWaveState);

        return () => waveManager.removePreparationTimeChanged(setWaveState);
    }, [waveManager]);

    const handleClick = () => {
        const tower = entitiesManager?.getEntity<TowerEntity>(state.id);
        if (tower) {
            towerSelector.selectedTower = tower;
        }
    }

    // ウェーブが準備フェーズか？
    const isWavePreparing = waveState === WaveState.Preparing;

    return (
        <EntityRenderer 
        state={state} 
        color={TowerTypeToColor(state.towerType)} 
        onClick={isWavePreparing ? handleClick : undefined}>
            Level: {state.level}
        </EntityRenderer>
    );
}

/**
 * コンポーネントの再描画条件
 * @param prev
 * @param next
 * @returns 
 */
function areEqual(prev: TowerRendererProps, next: TowerRendererProps): boolean {
    return prev.state.level === next.state.level;
}

/**
 * タワーの色
 * @param towerType 
 * @returns 
 */
function TowerTypeToColor(towerType: TowerType): string {
    switch(towerType)
    {
        case TowerType.Normal:
            return "yellow";
        case TowerType.DefenseDown:
            return "orange";
        case TowerType.SpeedDown:
            return "blue";
    }
}

export const MemoizedTowerRenderer = memo(TowerRenderer, areEqual);