import { JSX, useEffect, useState } from "react";
import { GameManager } from "../../game/core/GameManager";

import "../../css/uis/TowerPaletteRenderer.css"
import { GameLifecycleState } from "../../game/core/GamelifecycleState";
import { WaveState } from "../../game/wave/WaveState";
import { TowerParameterTable } from "../../game/entities/tower/TowerParameterTable";
import { TowerType } from "../../game/entities/tower/TowerType";

interface TowerPaletteRendererProps {
    gameState: GameLifecycleState
}

export function TowerPaletteRenderer({ gameState }: TowerPaletteRendererProps): JSX.Element | null {
    const gameManager = GameManager.getInstance();
    const waveManager = gameManager.waveManager;

    const [waveState, setWaveState] = useState(() => waveManager?.getWaveState() ?? WaveState.Preparing);

    useEffect(() => {
        if (!waveManager) return;

        setWaveState(waveManager.getWaveState());

        const onWaveChanged = (state: WaveState) => {
            setWaveState(state);
        }

        waveManager.addWaveStateChanged(onWaveChanged);

        return () => {
            waveManager.removeWaveStateChanged(onWaveChanged);
        }
    }, [waveManager]);

    const handleDragStart = (e: React.DragEvent, towerType: TowerType) => {
        if (gameManager.isGamePaused()) {
            e.preventDefault();
            return;
        }

        // 現在ドラッグ状態にあるタワータイプを設定
        e.dataTransfer.setData("towerType", towerType.toString());
    };

    if (gameState === GameLifecycleState.NotStarted) {
        return null;
    }

    if (waveState !== WaveState.Preparing) {
        return null;
    }

    return (
        <div
            className="tower-palette">
            {Object.values(TowerType).filter(v => typeof v === "number").map((type) => (
                <div
                    key={type}
                    className="tower-icon"
                    draggable={!gameManager.isGamePaused()}
                    onDragStart={(e) => handleDragStart(e, type as TowerType)}
                    style={{
                        cursor: gameManager.isGamePaused() ? "not-allowed" : "grab",
                    }}>
                    {TowerType[type as TowerType]}<br />
                    {'$' + TowerParameterTable.getBuyAmount(type as TowerType, 1)}
                </div>
            ))}
        </div>
    );
}