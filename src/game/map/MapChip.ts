import { Vector2 } from "../math/Vector2";
import { MapChipType } from "./MapChipType";

export class MapChip {
    constructor(
        private _position: Vector2, // 座標
        private _mapChipType: MapChipType, // マップチップの種類
    ) {}

    /**
     * 座標
     */
    public get position(): Vector2 {
        return this._position;
    }

    /**
     * マップチップの種類
     */
    public get mapChipType(): MapChipType {
        return this._mapChipType;
    }
}