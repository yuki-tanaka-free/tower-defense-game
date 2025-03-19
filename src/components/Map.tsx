import React, { useEffect, useState } from "react";
import { MapManager } from "../game/map/MapManager";
import { MapChip } from "../game/map/MapChip";
import { MapChipType } from "../game/map/MapChipType";

/**
 * マップの描画用コンポーネント
 */
export const Map: React.FC = () => {
    const [mapData, setMapData] = useState<MapChip[][] | null>(null);
    const mapManager = new MapManager();

    // マップの読み込み
    useEffect(() => {
        const load = async () => {
            await mapManager.loadMap();
            setMapData([...mapManager.map]); // map の参照を変更し、再レンダリングを促す
        };
        load();
    }, []);

    if (!mapData) {
        return <p>マップをロード中...</p>;
    }

    return (
        <pre>
            {mapData.map((row, y) => (
                <div key={y}>
                    {row.map((chip) => getMapChipSymbol(chip.mapChipType)).join(" ")}
                </div>
            ))}
        </pre>
    );
};

/**
 * マップチップの種類に応じた記号を取得
 */
const getMapChipSymbol = (type: MapChipType): string => {
    switch (type) {
        case MapChipType.PlayerBase:
            return "P"; // プレイヤーの基地
        case MapChipType.EnemyBase:
            return "E"; // エネミーの基地
        case MapChipType.Mountain:
            return "M"; // 山
        case MapChipType.Sea:
            return "S"; // 海
        case MapChipType.EnemyRoute:
            return "R"; // エネミーの経路
        case MapChipType.Tower:
            return "T"; // タワー
        default:
            return "N"; // 空
    }
};