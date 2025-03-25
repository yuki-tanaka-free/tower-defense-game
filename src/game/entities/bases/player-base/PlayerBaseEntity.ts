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
     * 更新処理
     */
    public update(_deltaTime: number): void {

    }

    /**
     * 敵がダメージを受ける
     * @param damage 受けるダメージ量
     */
    public takeDamage(damage: number): void {
        const newHp = Math.max(0, this._hp - damage);
        if (newHp !== this._hp) {
            this._hp = newHp;
            this.markDirty();
        }
    }

    /**
     * 死亡時処理
     */
    public destroy(): void {}

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