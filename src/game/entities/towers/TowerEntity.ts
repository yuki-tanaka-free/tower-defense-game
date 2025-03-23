import { Vector2 } from "../../math/Vector2";
import { Entity } from "../Entity";
import { EntityType } from "../EntityType";
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
 * タワークラス
 */
export class TowerEntity extends Entity<TowerState> {
    constructor(
        position: Vector2,             // 座標
        private _towerType: TowerType, // タワーの種類
        private _level: number, // タワーのレベル
        private _attackPower: number, // 攻撃力
        private _attackRange: number, // 攻撃範囲
        private _attackType: TowerAttackType, // 攻撃の種類
        private _defensePower: number, // 防御力
        private _buyAmount: number, // 購入時の値段
        private _updateAmount: number, // アップグレードにかかる値段
        private _saleAmount: number // 売る時の値段
    ) {
        super(position);
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
    public update(_deltaTime: number): void {

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
            updateAmount: this._updateAmount, 
            saleAmount: this._saleAmount, 
            position: this.position 
        }));
    }
}