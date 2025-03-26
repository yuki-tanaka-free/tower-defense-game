import { ColliderType } from "../../collision/CircleCollider";
import { Vector2 } from "../../math/Vector2";
import { EnemyEntity } from "../enemy/EnemyEntity";
import { Entity } from "../Entity";
import { EntityState } from "../EntityState";
import { EntityType } from "../EntityType";
import { TowerParameterTable } from "./TowerParameterTable";
import { TowerState } from "./TowerState";
import { TowerType } from "./TowerType";

/**
 * タワークラス
 */
export class TowerEntity extends Entity<TowerState> {
    private _cooldownTimer: number = 0; // 攻撃クールダウンタイマー
    private _collisionEnemies: EnemyEntity[] = [];

    constructor(
        position: Vector2,             // 座標
        private _towerType: TowerType, // タワーの種類
        private _level: number, // タワーのレベル
        private _attackPower: number, // 攻撃力
        private _attackRange: number, // 攻撃範囲
        private _attackCooltime: number, // 攻撃の間隔（秒）
        private _buyAmount: number, // 購入時の値段
        private _upgradeAmount: number, // アップグレードにかかる値段
        private _sellAmount: number // 売る時の値段
    ) {
        super(position);
        this.addCollider(this.attackRange, ColliderType.Attack);
    }

    /**
     * エンティティの種類
     */
    public get getEntityType(): EntityType {
        return EntityType.Tower;
    }

    /**
     * タワーの種類
     */
    public get towerType(): TowerType {
        return this._towerType;
    }

    /**
     * タワーのレベル
     */
    public get level(): number {
        return this._level;
    }

    /**
     * 攻撃力
     */
    public get attackPower(): number {
        return this._attackPower;
    }

    /**
     * 攻撃範囲
     */
    public get attackRange(): number {
        return this._attackRange;
    }

    /**
     * 攻撃の間隔
     */
    public get attackCooltime(): number {
        return this._attackCooltime;
    }

    /**
     * 購入時の金額
     */
    public get buyAmount(): number {
        return this._buyAmount;
    }

    /**
     * アップグレードにかかる値段
     */
    public get upgradeAmount(): number {
        return this._upgradeAmount;
    }

    /**
     * 売る時の値段
     */
    public get sellAmount(): number {
        return this._sellAmount;
    }

    /**
     * 更新処理
     */
    public update(deltaTime: number): void {
        if (this._cooldownTimer > 0) {
            this._cooldownTimer -= deltaTime;
        }
    }

    /**
     * 死亡時処理
     */
    public destroy(): void {}

    public upgrade(): void {
        this._level++;
        const newParam = TowerParameterTable.getParam(this.towerType, this.level);
        this._attackPower = newParam.attack;
        this._attackRange = newParam.attackRange;
        this._attackCooltime = newParam.attackCooltime;
        this._buyAmount = newParam.buyAmount;
        this._upgradeAmount = newParam.upgradeAmount;
        this._sellAmount = newParam.sellAmount;
        
        this.markDirty();
    }

    /**
     * 当たり判定後に呼ばれる更新処理
     */
    public lateUpdate(_deltaTime: number): void {
        if (this._cooldownTimer > 0) return;
        if (this._collisionEnemies.length === 0) return;
    
        let nearest: EnemyEntity | null = null;
        let minDist = Infinity;
    
        // 当たったエネミーから最も近い敵を探す
        for (const enemy of this._collisionEnemies) {
            const dist = this.position.distance(enemy.position);
            if (dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        }
    
        // 最も近い敵を攻撃する
        if (nearest) {
            this.attack(nearest);
            this._cooldownTimer = this._attackCooltime;
        }
    
        this._collisionEnemies.length = 0; // リストリセット
    }

    /**
     * 攻撃を行う
     * @param enemy 
     */
    private attack(enemy: EnemyEntity): void {
        switch(this._towerType) {
            case TowerType.Normal:
                enemy.takeDamage(this._attackPower);
                break;
            case TowerType.DefenseDown:
                enemy.defenseDown(this._attackPower);
                break;
            case TowerType.SpeedDown:
                enemy.speedDown(this._attackPower);
                break;
        }
    }

    public override onCollisionStay(
        other: Entity<EntityState>,
        otherColliderType: ColliderType,
        selfColliderType: ColliderType
    ): void {
        if (selfColliderType !== ColliderType.Attack) return;
        if (!(other instanceof EnemyEntity)) return;
        if (!other.isAlive()) return;
        if (otherColliderType !== ColliderType.Hitbox) return;
        if (this._cooldownTimer > 0) return; // クールダウン中なら無視
    
        this._collisionEnemies.push(other);
    }

    /**
     * 描画に必要な情報を返す
     * @returns 
     */
    public getState(): TowerState {
        return this.getCachedState(() => ({ 
            id: this.id,
            towerType: this._towerType,
            level: this._level,
            buyAmount: this._buyAmount, 
            updateAmount: this._upgradeAmount, 
            saleAmount: this._sellAmount, 
            position: this.position 
        }));
    }
}
