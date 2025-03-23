import { Vector2 } from "../../../math/Vector2";
import { Entity } from "../../Entity";
import { EnemyBaseState } from "./EnemyBaseState";

/**
 * 敵の基地
 */
export class EnemyBaseEntity extends Entity<EnemyBaseState> {
    constructor(
        protected _position: Vector2, // 座標
    ){
        super(_position);
    }

    /**
     * 行動を起こす
     */
    public update(_deltaTime: number): void {
        
    }

    /**
     * 描画に必要な情報を渡す
     */
    public getState(): EnemyBaseState {
        return { 
            id: this.id,
            position: this._position 
        }
    }
}