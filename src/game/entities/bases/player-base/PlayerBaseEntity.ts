import { Vector2 } from "../../../math/Vector2";
import { Entity } from "../../Entity";
import { PlayerBaseState } from "./PlayerBaseState";

/**
 * プレイヤーの基地
 */
export class PlayerBaseEntity extends Entity<PlayerBaseState> {
    constructor(
        protected _position: Vector2, // 座標
        protected _hp: number // 体力
    ) {
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
    public getState(): PlayerBaseState {
        return { 
            id: this.id,
            position: this._position,
            hp: this._hp
        }
    }
}