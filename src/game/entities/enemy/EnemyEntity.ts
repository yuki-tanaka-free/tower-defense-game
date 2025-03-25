import { Vector2 } from "../../math/Vector2";
import { PlayerBaseEntity } from "../bases/player-base/PlayerBaseEntity";
import { Entity } from "../Entity";
import { EntityState } from "../EntityState";
import { EntityType } from "../EntityType";
import { EnemyState } from "./EnemyState";
import { EnemyType } from "./EnemyType";

/**
 * 敵キャラクター
 */
export class EnemyEntity extends Entity<EnemyState> {
    private _pathIndex: number = 0; // エネミーが今何番目の経路を目指しているか
    private _cooldownTimer: number = 0; // 攻撃クールダウンタイマー

    private _baseSpeed: number; // 元の速度
    private _slowTimer: number = 0; // 残りのスロー時間
    private _slowRate: number = 0.5; // 速度低下は一律50%ダウン

    private _baseDefense: number; // 元の防御力
    private _defenseDownTimer: number = 0; // 防御力低下の残り時間
    private _defenseDownRate: number = 0.5; // 防御力低下率（50%）

    constructor(
        position: Vector2,                  // 座標
        private _enemyPath: Vector2[],      // エネミーの経路
        private _enemyType: EnemyType,      // 敵の種類
        private _hp: number,                // 体力
        private _attackPower: number,       // 攻撃力
        private _attackCooltime: number,    // 攻撃の間隔（秒）
        private _defensePower: number,      // 防御力
        private _speed: number,             // 移動速度
        private _attackRange: number        // 攻撃範囲
    ) {
        super(position);
        this._baseSpeed = _speed;
        this._baseDefense = _defensePower;
        this.setCollider(this.attackRange);
    }

    /**
     * エンティティの種類
     */
    public get getEntityType(): EntityType {
        return EntityType.Enemy;
    }

    /**
     * 敵の種類
     */
    public get enemyType(): EnemyType {
        return this._enemyType;
    }

    /**
     * 体力
     */
    public get hp(): number {
        return this._hp;
    }

    /**
     * 攻撃力
     */
    public get attackPower(): number {
        return this._attackPower;
    }

    /**
     * 防御力
     */
    public get defensePower(): number {
        return this._defensePower;
    }

    /**
     * 移動速度
     */
    public get speed(): number {
        return this._speed;
    }

    /**
     * 攻撃範囲
     */
    public get attackRange(): number {
        return this._attackRange;
    }

    /**
     * 敵がダメージを受ける
     * @param damage 受けるダメージ量
     */
    public takeDamage(damage: number): void {
        const actualDamage = Math.max(0, damage - this._defensePower);
        const newHp = Math.max(0, this._hp - actualDamage);
        if (newHp !== this._hp) {
            this._hp = newHp;
            this.markDirty();
        }
    }

    /**
     * 防御力低下
     * @param reduceSecond 何秒間防御力低下させるか
     */
    public defenseDown(reduceSecond: number): void {
        if (this._defenseDownTimer < reduceSecond) {
            this._defenseDownTimer = reduceSecond;
            this._defensePower = this._baseDefense * this._defenseDownRate;
            this.markDirty();
        }
    }

    /**
     * 速度低下
     * @param speedDownSecond 何秒間速度低下させるか
     */
    public speedDown(speedDownSecond: number): void {
        if (this._slowTimer < speedDownSecond) {
            this._slowTimer = speedDownSecond;
            this._speed = this._baseSpeed * this._slowRate;
            this.markDirty();
        }
    }

    /**
     * 更新処理
     * @param deltaTime 
     */
    public update(deltaTime: number): void {
        if (this._enemyPath.length === 0 || this._pathIndex >= this._enemyPath.length) return;

        // 攻撃のクールダウン
        if (this._cooldownTimer > 0) {
            this._cooldownTimer -= deltaTime;
        }

        // スロー解除処理
        if (this._slowTimer > 0) {
            this._slowTimer -= deltaTime;
            if (this._slowTimer <= 0) {
                this._speed = this._baseSpeed;
                this.markDirty();
            }
        }

        // 防御デバフ解除処理
        if (this._defenseDownTimer > 0) {
            this._defenseDownTimer -= deltaTime;

            if (this._defenseDownTimer <= 0) {
                this._defensePower = this._baseDefense;
                this.markDirty();
            }
        }

        const targetPos = this._enemyPath[this._pathIndex];
        const direction = targetPos.sub(this.position);
        const distance = direction.magnitude();

        if (distance < 0.05) {
            // 到達とみなして次へ
            this.position = targetPos;
            this._pathIndex++;
        }
        else {
            const moveVector = direction.normalize().mul(this._speed * deltaTime);
            this.position = this.position.add(moveVector);
        }
    }

    /**
     * 攻撃を行う
     */
    public attack(playerBase: PlayerBaseEntity): void {
        playerBase.takeDamage(this._attackPower);
    };

    /**
     * 敵が生存しているか確認
     */
    public isAlive(): boolean {
        return this._hp > 0;
    }

    /**
     * なにかに当たった時呼ばれる
     * @param other 
     */
    public override onCollisionStay(other: Entity<EntityState>): void {
        if (other instanceof PlayerBaseEntity) {
            if (this._cooldownTimer <= 0) {
                this.attack(other);
                this._cooldownTimer = this._attackCooltime;
            }
        }
    }

    /**
     * 描画に必要な情報を返す
     * @returns 
     */
    public getState(): EnemyState {
        return this.getCachedState(() => ({
            id: this.id,
            enemyType: this._enemyType,
            position: this.position,
            hp: this._hp
        }));
    }
}
