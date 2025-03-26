import { Entity } from "../../Entity";
import { EntityType } from "../../EntityType";
import { EnemyBaseState } from "./EnemyBaseState";

/**
 * 敵の基地
 */
export class EnemyBaseEntity extends Entity<EnemyBaseState> {

    /**
     * エンティティの種類
     */
    public get getEntityType(): EntityType {
        return EntityType.EnemyBase;
    }

    /**
     * 更新処理
     */
    public update(_deltaTime: number): void {
        
    }

    /**
     * 当たり判定後に呼ばれる更新処理
     */
    public lateUpdate(_deltaTime: number): void {
        
    }

    /**
     * 死亡時処理
     */
    public destroy(): void {}

    /**
     * 描画に必要な情報を渡す
     */
    public getState(): EnemyBaseState {
        return this.getCachedState(() => ({ 
            id: this.id,
            position: this.position 
        }));
    }
}