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
     * 行動を起こす
     */
    public update(_deltaTime: number): void {
        
    }

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