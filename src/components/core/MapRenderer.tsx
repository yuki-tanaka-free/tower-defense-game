import { memo, JSX } from "react";
import { MapChip } from "../../game/map/MapChip";
import { MapChipType } from "../../game/map/MapChipType";
import { GameSettings } from "../settings/GameSettings";
import { GameManager } from "../../game/core/GameManager";
import "../../css/core/MapRenderer.css"

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

function MapRenderer(): JSX.Element {
    const mapManager = GameManager.getInstance().mapManager;
    if (!mapManager) return <p>マップデータがありません。</p>

    const mapData: MapChip[][] = mapManager.map;
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

export const MemoizedMapRenderer = memo(MapRenderer);