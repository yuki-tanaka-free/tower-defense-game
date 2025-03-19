import { Vector2 } from "../../math/Vector2";
import { Entity } from "../Entity";

/**
 * 海
 */
export class SeaEntity extends Entity {
    constructor(
        protected _position: Vector2, // 座標
    ){
        super(_position);
    }

    public action(): void {
        /* 特に行動は無し */
    }
}