import { CsvLoader } from "../../utils/CsvLoader";
import { TowerType } from "./TowerEntity";

interface TowerParameter {
    attack: number;
    attackRange: number;
    buyAmount: number;
    upgradeAmount: number;
    sellAmount: number;
}

/**
 * CSVのデータからタワーの各種データに変換するクラス
 * レベル１、レベル２、といった風にデータが入っている
 */
export class TowerParameterTable {
    private static paramTable: Map<TowerType, Map<number, TowerParameter>> = new Map();

    private constructor() {}

    /**
     * パラメータを読み込み（初期化時に呼び出す）
     */
    public static async load(): Promise<void> {
        const rows = await CsvLoader.loadCsv("/assets/towersParams.csv");

        for (const row of rows) {
            const [towerTypeStr, levelStr, atkStr, rangeStr, buyStr, upStr, sellStr] = row.split(",");

            const type = Number(towerTypeStr) as TowerType;
            const level = Number(levelStr);
            const param: TowerParameter = {
                attack: Number(atkStr),
                attackRange: Number(rangeStr),
                buyAmount: Number(buyStr),
                upgradeAmount: Number(upStr),
                sellAmount: Number(sellStr),
            };

            if (!this.paramTable.has(type)) {
                this.paramTable.set(type, new Map());
            }
            this.paramTable.get(type)!.set(level, param);
        }
    }

    /**
     * パラメータ取得（存在しない場合はデフォルト） 
     */
    public static getParam(type: TowerType, level: number): TowerParameter {
        return this.paramTable.get(type)?.get(level) ?? {
            attack: 1,
            attackRange: 1,
            buyAmount: 0,
            upgradeAmount: 0,
            sellAmount: 0,
        };
    }

    /**
     * 攻撃力
     * @param type 
     * @param level 
     * @returns 
     */
    public static getAttack(type: TowerType, level: number): number {
        return this.getParam(type, level).attack;
    }

    /**
     * 攻撃範囲
     * @param type 
     * @param level 
     * @returns 
     */
    public static getAttackRange(type: TowerType, level: number): number {
        return this.getParam(type, level).attackRange;
    }

    /**
     * 購入価格
     * @param type 
     * @param level 
     * @returns 
     */
    public static getBuyAmount(type: TowerType, level: number): number {
        return this.getParam(type, level).buyAmount;
    }

    /**
     * アップグレード価格
     * @param type 
     * @param level 
     * @returns 
     */
    public static getUpgradeAmount(type: TowerType, level: number): number {
        return this.getParam(type, level).upgradeAmount;
    }

    /**
     * 売却価格
     * @param type 
     * @param level 
     * @returns 
     */
    public static getSellAmount(type: TowerType, level: number): number {
        return this.getParam(type, level).sellAmount;
    }
}