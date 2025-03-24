import { EnemyType } from "../entities/enemy/EnemyType";
import { CsvLoader } from "../utils/CsvLoader";
import { EnemySpawnData } from "./EnemySpawnData";

/**
 * ウェーブ
 */
export class Wave {
    /**
     * このウェーブで出現する敵群
     */
    private _enemySpawnDatas: EnemySpawnData[] = [];
    /**
     * ウェーブクリア時に貰える報酬
     */
    private _clearBonus: number = 0;

    private constructor() {}

    /**
     * ウェーブ生成
     * @param stageNum 
     * @returns 
     */
    public static async create(stageNum: number): Promise<Wave> {
        const wave = new Wave();
        await wave.loadWave(stageNum);
        return wave;
    }

    /**
     * ウェーブをロード
     */
    private async loadWave(stageNum: number) {
        await this.loadSpawnDatas(stageNum);
        await this.loadWaveClearBonus(stageNum);
    }

    /**
     * このウェーブの敵群を読み込み
     * @param stageNum
     */
    private async loadSpawnDatas(stageNum: number) {
        // CSVデータの読み込み
        const rows = await CsvLoader.loadCsv("/assets/wave/wave" + stageNum + "enemies.csv");

        // 各行ごとにCSVを読み込み
        this._enemySpawnDatas = rows.map((row) => {
            const [enemyTypeStr, levelStr, spawnSecondStr] = row.split(",");
            return {
                enemyType: Number(enemyTypeStr) as EnemyType,
                level: Number(levelStr),
                spawnSecond: Number(spawnSecondStr)
            }
        });

        // 秒数順にソート
        this._enemySpawnDatas.sort((a, b) => a.spawnSecond - b.spawnSecond);
    }

    /**
     * このウェーブの報酬を読み込み
     * @param stageNum 
     */
    private async loadWaveClearBonus(stageNum: number) {
        // CSVデータの読み込み
        const rows = await CsvLoader.loadCsv("/assets/wave/waveBonus.csv");

        // 現在のステージ数に応じた報酬を読み込み
        this._clearBonus = Number(rows[stageNum]);
    }

    /**
     * このウェーブで出現する敵群
     */
    public get enemySpawnDatas(): EnemySpawnData[] {
        return this._enemySpawnDatas;
    }

    /**
     * ウェーブクリア時に貰える報酬
     */
    public get clearBonus(): number {
        return this._clearBonus;
    }
}