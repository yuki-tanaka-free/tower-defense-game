import { Vector2 } from "../../../math/Vector2";
import { Entity } from "../../Entity";
import { EntityType } from "../../EntityType";
import { PlayerBaseState } from "./PlayerBaseState";

/**
 * プレイヤーの基地
 */
export class PlayerBaseEntity extends Entity<PlayerBaseState> {
    constructor(
        position: Vector2, // 座標
        protected _hp: number // 体力
    ) {
        super(position);
    }

    /**
     * エンティティの種類
     */
    public get getEntityType(): EntityType {
        return EntityType.PlayerBase;
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
        return this.getCachedState(() => ({ 
            id: this.id,
            position: this.position,
            hp: this._hp
        }));
    }
}