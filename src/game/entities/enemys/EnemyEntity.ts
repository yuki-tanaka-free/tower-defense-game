import { Vector2 } from "../../math/Vector2";
import { Entity } from "../Entity";

/**
 * 敵の種類
 */
export enum EnemyType {
    Normal,  // 通常の敵
    Fast,    // 速度の速い敵
    Tank     // 体力の高い敵
}

/**
 * 敵キャラクターのベースクラス
 */
export abstract class EnemyEntity extends Entity {
    
    constructor(
        protected _position: Vector2,   // 座標
        protected _enemyType: EnemyType, // 敵の種類
        protected _hp: number,      // 体力
        protected _attackPower: number, // 攻撃力
        protected _defensePower: number,// 防御力
        protected _speed: number,       // 移動速度
        protected _attackRange: number  // 攻撃範囲
    ) {
        super(_position);
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
        this._hp = Math.max(0, this._hp - actualDamage);
    }

    /**
     * 敵を移動させる
     * @param direction 移動方向
     */
    public move(direction: Vector2): void {
        this._position = new Vector2(
            this._position.x + direction.x * this._speed,
            this._position.y + direction.y * this._speed
        );
    }

    /**
     * 攻撃を行う（具体的な攻撃ロジックは派生クラスで実装）
     */
    abstract attack(): void;

    /**
     * 敵が生存しているか確認
     */
    public isAlive(): boolean {
        return this._hp > 0;
    }
}
