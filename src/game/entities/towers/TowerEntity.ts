import { Vector2 } from "../../math/Vector2";
import { Entity } from "../Entity";
import { TowerState } from "./TowerState";

/**
 * タワーの種類
 */
export enum TowerType {
    Tower1,
    Tower2,
    Tower3
}

/**
 * タワーの攻撃タイプ
 */
export enum TowerAttackType {
    Normal, // 通常攻撃
    DefenseDown, // 防御力低下
    SpeedDown, // 速度低下
}

/**
 * 全てのタワーの親クラス
 */
export abstract class TowerEntity extends Entity<TowerState> {
    constructor(
        protected _position: Vector2, // 座標
        protected _towerType: TowerType, // タワーの種類
        protected _attackPower: number, // 攻撃力
        protected _attackRange: number, // 攻撃範囲
        protected _attackType: TowerAttackType, // 攻撃の種類
        protected _defensePower: number, // 防御力
        protected _buyAmount: number, // 購入時の値段
        protected _updateAmount: number, // アップグレードにかかる値段
        protected _saleAmount: number // 売る時の値段
    ) {
        super(_position);
    }

    /**
     * タワーの種類
     */
    public get towerType(): TowerType {
        return this._towerType;
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
     * 攻撃の種類
     */
    public get attackType(): TowerAttackType {
        return this._attackType;
    }

    /**
     * 防御力
     */
    public get defensePower(): number {
        return this._defensePower;
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
    public get updateAmount(): number {
        return this._updateAmount;
    }

    /**
     * 売る時の値段
     */
    public get saleAmount(): number {
        return this._saleAmount;
    }

    /**
     * 行動を起こす
     */
    public abstract update(deltaTime: number): void;

    /**
     * 描画に必要な情報を返す
     * @returns 
     */
    public getState(): TowerState {
        return { 
            id: this.id,
            towerType: this._towerType, 
            buyAmount: this._buyAmount, 
            updateAmount: this._updateAmount, 
            saleAmount: this._saleAmount, 
            position: this._position 
        }
    }
}