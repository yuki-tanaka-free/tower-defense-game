import { Vector2 } from "../../math/Vector2";
import { Entity } from "../Entity";
import { EntityType } from "../EntityType";
import { TowerState } from "./TowerState";

/**
 * タワーの種類（そのまま攻撃の種類になる）
 */
export enum TowerType {
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
        private _buyAmount: number, // 購入時の値段
        private _upgradeAmount: number, // アップグレードにかかる値段
        private _sellAmount: number // 売る時の値段
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
            updateAmount: this._upgradeAmount, 
            saleAmount: this._sellAmount, 
            position: this.position 
        }));
    }
}