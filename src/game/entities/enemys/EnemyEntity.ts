import { Vector2 } from "../../math/Vector2";
import { Entity } from "../Entity";
import { EnemyState } from "./EnemyState";
import { EnemyType } from "./EnemyType";

/**
 * 敵キャラクターのベースクラス
 */
export class EnemyEntity extends Entity<EnemyState> {
    private _pathIndex: number = 0;

    constructor(
        protected _position: Vector2,    // 座標
        private _enemyPath: Vector2[], // エネミーの経路
        private _enemyType: EnemyType, // 敵の種類
        private _hp: number,           // 体力
        private _attackPower: number,  // 攻撃力
        private _defensePower: number, // 防御力
        private _speed: number,        // 移動速度
        private _attackRange: number   // 攻撃範囲
    ) {
        super(_position);

        console.log(_enemyPath.length);
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
     * 更新処理
     * @param deltaTime 
     */
    public update(deltaTime: number): void {
        if (this._enemyPath.length === 0 || this._pathIndex >= this._enemyPath.length) return;
        
        const targetPos = this._enemyPath[this._pathIndex];
        const direction = targetPos.sub(this.position);
        const distance = direction.magnitude();

        if (distance < 0.05) {
            // 到達とみなして次へ
            this._position = targetPos;
            this._pathIndex++;
        }
        else {
            const moveVector = direction.normalize().mul(this._speed * deltaTime);
            this._position = this._position.add(moveVector);
        }
    }

    /**
     * 攻撃を行う
     */
    public attack(): void {

    };

    /**
     * 敵が生存しているか確認
     */
    public isAlive(): boolean {
        return this._hp > 0;
    }

    /**
     * 描画に必要な情報を返す
     * @returns 
     */
    public getState(): EnemyState {
        return {
            id: this.id,
            enemyType: this._enemyType,
            position: this._position,
            hp: this._hp
        };
    }
}
