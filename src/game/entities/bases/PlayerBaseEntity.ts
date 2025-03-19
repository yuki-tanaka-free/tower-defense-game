import { Vector2 } from "../../math/Vector2";
import { Entity } from "../Entity";

/**
 * プレイヤーの基地
 */
export class PlayerBaseEntity extends Entity {
    constructor(
        protected _position: Vector2, // 座標
        protected _hp: number // 体力
    ){
        super(_position);
    }

    public action(): void {
        
    }
}