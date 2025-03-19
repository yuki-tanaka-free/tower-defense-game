import { Vector2 } from "../math/Vector2";
import { EnemyBaseEntity } from "../entities/bases/EnemyBaseEntity";
import { PlayerBaseEntity } from "../entities/bases/PlayerBaseEntity";
import { Entity } from "../entities/Entity";
import { EnemyRouteEntity } from "../entities/envilonments/EnemyRouteEntity";
import { MountainEntity } from "../entities/envilonments/MountainEntity";
import { SeaEntity } from "../entities/envilonments/SeaEntity";
import { MapChip } from "./MapChip";
import { MapChipType } from "./MapChipType";


/**
 * CSVの文字をマップチップの種類に変換
 */
const mapCharToType: Record<string, MapChipType> = {
    "N": MapChipType.None,
    "P": MapChipType.PlayerBase,
    "E": MapChipType.EnemyBase,
    "M": MapChipType.Mountain,
    "S": MapChipType.Sea,
    "T": MapChipType.Tower,
    "R": MapChipType.EnemyRoute
}

/**
 * マップマネージャー
 */
export class MapManager {
    /**
     * マップ
     */
    private _map: MapChip[][];

    constructor() {
        // 15 * 15 でマップを初期化（`null` ではなく `MapChip` オブジェクトを入れる）
        this._map = Array.from({ length: 15 }, (_, y) =>
            Array.from({ length: 15 }, (_, x) => new MapChip(new Vector2(x, y), MapChipType.None, null))
        );
    }

    /**
     * マップロード時のエンティティ生成関数
     * @param mapChipType マップチップの種類
     * @param position 座標
     * @returns 
     */
    private createEntityForMapChipType(mapChipType: MapChipType, position: Vector2): Entity | null {
        switch (mapChipType) {
            case MapChipType.PlayerBase:
                return new PlayerBaseEntity(position, 100);
            case MapChipType.EnemyBase:
                return new EnemyBaseEntity(position);
            case MapChipType.Mountain:
                return new MountainEntity(position);
            case MapChipType.Sea:
                return new SeaEntity(position);
            case MapChipType.EnemyRoute:
                return new EnemyRouteEntity(position);
            case MapChipType.Tower:
                return null; // タワーは設置時に後で設定
            default:
                return null;
        }
    }

    public async loadMap() {
        const mapCsvData = await fetch("/assets/map.csv");
        const mapRawText = await mapCsvData.text();

        console.log(mapRawText);

        // CSVを行ごとに分解 \r（CR）を除去し、LF（\n）で統一
        const rows = mapRawText.replace(/\r/g, "").trim().split("\n");

        // 各行ごとにCSVを読み込み
        this._map = rows.map((row, y) =>
            row.split(",").map((cell, x) => {
                // マップチップの種類に応じたエンティティの生成
                const mapChipType = mapCharToType[cell] || MapChipType.None;
                // console.log(cell);
                const entity = this.createEntityForMapChipType(mapChipType, new Vector2(x, y));
                return new MapChip(new Vector2(x, y), mapChipType, entity)
            }));
    }

    /**
     * マップチップ
     */
    public get map(): MapChip[][] {
        return this._map;
    }

    /**
     * 指定した座標のマップチップを取得
     * @param position 取得したい座標
     */
    public getMapChip(position: Vector2): MapChip | null {
        if (
            position.x < 0 || position.x >= this._map.length ||
            position.y < 0 || position.y >= this._map[0].length
        ) {
            console.warn(`getMapChip: 無効な座標です (${position.x}, ${position.y})`);
            return null;
        }
        return this._map[position.x][position.y];
    }
}