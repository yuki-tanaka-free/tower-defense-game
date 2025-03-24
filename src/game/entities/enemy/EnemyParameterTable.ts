import { CsvLoader } from "../../utils/CsvLoader";
import { EnemyType } from "./EnemyType";

interface EnemyParameter {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    range: number;
}

/**
 * CSVのデータからエネミーの各種データに変換するクラス
 * レベル１、レベル２、といった風にデータが入っている
 */
export class EnemyParameterTable {
    private static paramTable: Map<EnemyType, Map<number, EnemyParameter>> = new Map()

    private constructor() {}

    /**
     * パラメータを読み込み（初期化時に呼び出す）
     */
    public static async load(): Promise<void> {
        const rows = await CsvLoader.loadCsv("/assets/enemiesParams.csv");

        for (const row of rows) {
            const [enemyTypeStr, levelStr, hpStr, atkStr, defStr, spdStr, rngStr] = row.split(",");

            const type = Number(enemyTypeStr) as EnemyType;
            const level = Number(levelStr);
            const param: EnemyParameter = {
                hp: Number(hpStr),
                attack: Number(atkStr),
                defense: Number(defStr),
                speed: Number(spdStr),
                range: Number(rngStr),
            };

            if (!this.paramTable.has(type)) {
                this.paramTable.set(type, new Map());
            }
            this.paramTable.get(type)!.set(level, param);
        }
    }

    /**
     * パラメータ取得（存在しない場合はデフォルト）
     * @param type 
     * @param level 
     * @returns 
     */
    public static getParam(type: EnemyType, level: number): EnemyParameter {
        return this.paramTable.get(type)?.get(level) ?? {
            hp: 1,
            attack: 1,
            defense: 1,
            speed: 1,
            range: 1,
        }
    }

    /**
     * 体力
     * @param type 
     * @param level 
     * @returns 
     */
    public static getHp(type: EnemyType, level: number): number {
        return this.getParam(type, level).hp;
    }

    /**
     * 攻撃力
     * @param type 
     * @param level 
     * @returns 
     */
    public static getAttack(type: EnemyType, level: number): number {
        return this.getParam(type, level).attack;
    }
    
    /**
     * 防御力
     * @param type 
     * @param level 
     * @returns 
     */
    public static getDefense(type: EnemyType, level: number): number {
        return this.getParam(type, level).defense;
    }

    /**
     * 速度
     * @param type 
     * @param level 
     * @returns 
     */
    public static getSpeed(type: EnemyType, level: number): number {
        return this.getParam(type, level).speed;
    }

    /**
     * 攻撃範囲
     * @param type 
     * @param level 
     * @returns 
     */
    public static getRange(type: EnemyType, level: number): number {
        return this.getParam(type, level).range;
    }
}
