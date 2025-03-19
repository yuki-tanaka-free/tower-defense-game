import { Vector2 } from "../../math/Vector2";
import { Entity } from "../Entity";

/**
 * 敵の基地
 */
export class EnemyBaseEntity extends Entity {
    constructor(
        protected _position: Vector2, // 座標
    ){
        super(_position);
    }

    public action(): void {
        
    }
}