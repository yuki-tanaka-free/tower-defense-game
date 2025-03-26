import { memo, JSX, useState, useEffect } from "react";
import { MapChipType } from "../../game/map/MapChipType";
import { GameSettings } from "../../game/settings/GameSettings";
import { MapManager } from "../../game/map/MapManager";
import "../../css/core/MapRenderer.css"
import { GameManager } from "../../game/core/GameManager";

function MapRenderer(): JSX.Element {
    const [mapManager, setMapManager] = useState<MapManager | null>(null);

    useEffect(() => {
        const gameManager = GameManager.getInstance();
        if (gameManager.mapManager) {
            setMapManager(gameManager.mapManager);
            return;
        }

        const checkInterval = setInterval(() => {
            const mm = GameManager.getInstance().mapManager;
            if (mm) {
                setMapManager(mm);
                clearInterval(checkInterval);
            }
        }, 100);
    }, []);

    if (!mapManager) {
        return <p>マップが初期化前です。</p>
    }

    const mapData = mapManager?.map;
    
    if (!mapData || mapData.length === 0) {
        return <p>マップデータがありません。</p>;
    }

    return (
        <div
            className="map-container"
            style={{
                gridTemplateColumns: `repeat(${mapData[0].length}, ${GameSettings.TILE_SIZE}px)`,
            }}
        >
            {mapData.flat().map((chip, index) => (
                <div
                    key={index}
                    className="map-ceil"
                    style={{
                        width: GameSettings.TILE_SIZE,
                        height: GameSettings.TILE_SIZE,
                        backgroundColor: getMapChipColor(chip.mapChipType),
                    }}
                />
            ))}
        </div>
    );
};

const getMapChipColor = (type: MapChipType): string => {
    switch (type) {
        case MapChipType.PlayerBase: return "green";
        case MapChipType.EnemyBase: return "red";
        case MapChipType.Mountain: return "brown";
        case MapChipType.Sea: return "blue";
        case MapChipType.EnemyRoute: return "gray";
        case MapChipType.Tower: return "yellow";
        default: return "lightgray";
    }
};

export const MemoizedMapRenderer = memo(MapRenderer);