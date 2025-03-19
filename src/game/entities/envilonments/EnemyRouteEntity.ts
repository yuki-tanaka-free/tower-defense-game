import { Vector2 } from "../../math/Vector2";
import { Entity } from "../Entity";

/**
 * 敵の経路
 */
export class EnemyRouteEntity extends Entity {
    constructor(
        protected _position: Vector2, // 座標
    ){
        super(_position);
    }

    public action(): void {
        /* 特に行動は無し */
    }
}