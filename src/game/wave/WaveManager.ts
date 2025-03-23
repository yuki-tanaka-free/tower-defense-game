import { EnemyEntity } from "../entities/enemys/EnemyEntity";
import { EnemyParameterTable } from "../entities/enemys/EnemyParameterTable";
import { EnemyType } from "../entities/enemys/EnemyType";
import { EntitiesManager } from "../entities/EntitiesManager";
import { MapManager } from "../map/MapManager";
import { EnemySpawnData } from "./EnemySpawnData";
import { Wave } from "./Wave";

export class WaveManager {
    private _waves: Wave[] = [];

    private currentWaveIndex: number = 0;
    private elapsedTime: number = 0;
    private spawnQueue: EnemySpawnData[] = [];

    private mapManager: MapManager;
    private entitiesManager: EntitiesManager;

    constructor(
        mapManager: MapManager,
        entityManager: EntitiesManager
    ) {
        this.mapManager = mapManager;
        this.entitiesManager = entityManager;
    }

    /**
     * 初期化（ウェーブ生成）
     */
    public async init(): Promise<void> {
        // ウェーブ1～4を生成
        for (var i = 1; i <= 4; i++) {
            const wave = await Wave.create(i);
            this._waves.push(wave);
        }
    }

    /**
     * 次のウェーブを開始する
     */
    public startNextWave(): void {
        if (this.isWaveRunning()) return; // ウェーブの重複開始を避ける
        this.startWave(this.currentWaveIndex);
        this.currentWaveIndex += 1;
    }

    /**
     * ウェーブを指定して開始する
     * @param index 
     * @returns 
     */
    public startWave(index: number): void {
        this.currentWaveIndex = index;
        const wave = this._waves[index];
        if (!wave) {
            console.error(`[WaveManager] 指定されたウェーブ ${index} が存在しません`);
            return;
        }

        this.spawnQueue = [...wave.enemySpawnDatas];
        this.elapsedTime = 0;
    }

    public update(deltaTime: number): void {
        if (this.spawnQueue.length <= 0) return;

        this.elapsedTime += deltaTime;

        // 同一秒にスポーンするエネミーに対応するため while にてチェック
        while (
            this.spawnQueue.length > 0 &&
            this.elapsedTime >= this.spawnQueue[0].spawnSecond
        ) {
            const data = this.spawnQueue.shift();
            if (data) {
                this.spawnEnemy(data.enemyType, data.level ?? 1);
            }
        }
    }

    /**
     * ウェーブが進行中か？
     */
    public isWaveRunning(): boolean {
        const waveInProgress = !this.isEnemySpawningFinished();
        const hasLivingEnemies = this.entitiesManager.getEnemyCount() > 0;
        return waveInProgress || hasLivingEnemies;
    }

    /**
     * 現在のウェーブが全ての敵を出しきったか？
     * @returns 
     */
    public isEnemySpawningFinished(): boolean {
        return this.spawnQueue.length === 0;
    }

    /**
     * 現在のウェーブのクリア報酬
     */
    public get clearBonus(): number {
        return this._waves[this.currentWaveIndex]?.clearBonus ?? 0;
    }

    /**
     * 敵の出現処理
     */
    private spawnEnemy(enemyType: EnemyType, level: number): void {
        const spawnPos = this.entitiesManager.getEnemySpawnPosition();

        const enemy = new EnemyEntity(
            spawnPos,
            this.mapManager.enemyPath,
            enemyType,
            EnemyParameterTable.getHp(enemyType, level),
            EnemyParameterTable.getAttack(enemyType, level),
            EnemyParameterTable.getDefense(enemyType, level),
            EnemyParameterTable.getSpeed(enemyType, level),
            EnemyParameterTable.getRange(enemyType, level)
        );

        this.entitiesManager.addEnemy(enemy);
    }
}