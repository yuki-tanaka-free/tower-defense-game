import { EnemyEntity } from "../entities/enemy/EnemyEntity";
import { EnemyParameterTable } from "../entities/enemy/EnemyParameterTable";
import { EnemyType } from "../entities/enemy/EnemyType";
import { EntitiesManager } from "../entities/EntitiesManager";
import { EntityType } from "../entities/EntityType";
import { MapManager } from "../map/MapManager";
import { EnemySpawnData } from "./EnemySpawnData";
import { Wave } from "./Wave";
import { WaveState } from "./WaveState";

export class WaveManager {
    private _waves: Wave[] = [];

    private currentWaveIndex: number = 0;
    private elapsedTime: number = 0;
    private spawnQueue: EnemySpawnData[] = [];

    // 準備時間
    private lastNotifiedSecond: number = -1; // 最後に通知した残り時間
    private preparationTimer: number = 0;
    private readonly defaultPreparationDuration: number = 60; // 60秒
    private preparationTimeListeners = new Set<(remainingSec: number) => void>();

    private mapManager: MapManager;
    private entitiesManager: EntitiesManager;

    private autoStartEnabled: boolean = false;

    private waveState: WaveState = WaveState.Preparing;
    private waveStateListeners = new Set<(state: WaveState) => void>();

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
     * ウェーブの自動開始設定
     * @param enabled 
     */
    public setAutoStartEnabled(enabled: boolean) {
        this.autoStartEnabled = enabled;
    }

    /**
     * 現在ウェーブが手動開始か自動開始かを返す
     * @returns 
     */
    public getAutoStartEnabled(): boolean {
        return this.autoStartEnabled;
    }

    /**
     * 現在のウェーブの状態を返す
     * @returns 
     */
    public getWaveState(): WaveState {
        return this.waveState;
    }

    /**
     * 現在のウェーブが何番目か返す
     * @returns 
     */
    public getCurrentWave(): number {
        return this.currentWaveIndex + 1;
    }

    /**
     * 準備の残り時間を返す
     * @returns 
     */
    public getRemainingPreparationTime(): number {
        return Math.max(0, Math.ceil(this.preparationTimer));
    }

    /**
     * 準備ステートに移行
     */
    public startPreparation(): void {
        this.preparationTimer = this.defaultPreparationDuration;
        this.waveState = WaveState.Preparing;
        this.notifyWaveStateChanged();

        if (this.autoStartEnabled) {
            this.startNextWave();
        }
    }

    /**
     * 次のウェーブを開始する
     */
    public startNextWave(): void {
        if (this.waveState !== WaveState.Preparing) return;

        const wave = this._waves[this.currentWaveIndex];
        if (!wave) {
            this.waveState = WaveState.GameClear;
            this.notifyWaveStateChanged();
            return;
        }

        this.spawnQueue = [...wave.enemySpawnDatas];
        this.elapsedTime = 0;
        this.waveState = WaveState.Running;
        this.notifyWaveStateChanged();
    }

    /**
     * ウェーブ完了後の処理
     */
    public proceedAfterCompletion(): void {
        this.currentWaveIndex++;
        this.startPreparation();
    }

    /**
     * ゲームオーバー処理
     */
    public triggerGameOver(): void {
        this.waveState = WaveState.GameOver;
        this.notifyWaveStateChanged();
    }

    /**
     * ウェーブの状態変更通知イベントを追加
     * @param listener 
     */
    public addWaveStateChanged(listener: (state: WaveState) => void) {
        this.waveStateListeners.add(listener);
    }

    /**
     * ウェーブの状態変更通知イベントを削除
     * @param listener 
     */
    public removeWaveStateChanged(listener: (state: WaveState) => void) {
        this.waveStateListeners.delete(listener);
    }

    /**
     * ウェーブの状態変更通知イベントに通知
     */
    private notifyWaveStateChanged() {
        for (const listener of this.waveStateListeners) {
            listener(this.waveState);
        }
    }

    /**
     * 残り時間変更イベントの追加
     * @param listener 
     */
    public addPreparationTimeChanged(listener: (remainingSec: number) => void) {
        this.preparationTimeListeners.add(listener);
    }
    
    /**
     * 残り時間変更イベントの削除
     * @param listener 
     */
    public removePreparationTimeChanged(listener: (remainingSec: number) => void) {
        this.preparationTimeListeners.delete(listener);
    }

    /**
     * 残り時間変更イベントに通知
     * @param remaining 
     */
    private notifyPreparationTimeChanged(remaining: number) {
        for (const listener of this.preparationTimeListeners) {
            listener(remaining);
        }
    }

    public update(deltaTime: number): void {
        // 準備時間のカウントダウン
        if (this.waveState === WaveState.Preparing) {
            this.preparationTimer -= deltaTime;

            const currentSec = Math.ceil(this.preparationTimer);
            if (currentSec !== this.lastNotifiedSecond) {
                this.lastNotifiedSecond = currentSec;
                this.notifyPreparationTimeChanged(currentSec);
            }

            if (this.preparationTimer <= 0) {
                if (this.autoStartEnabled) {
                    this.startNextWave(); // 自動開始
                } else {
                    // 手動開始待ち
                    this.preparationTimer = 0; // カウントは止めておく
                }
            }

            return;
        }

        // ウェーブ実行中の敵出現処理（既存）
        if (this.waveState === WaveState.Running) {
            this.elapsedTime += deltaTime;

            while (
                this.spawnQueue.length > 0 &&
                this.elapsedTime >= this.spawnQueue[0].spawnSecond
            ) {
                const data = this.spawnQueue.shift();
                if (data) this.spawnEnemy(data.enemyType, data.level ?? 1);
            }

            if (this.spawnQueue.length === 0 &&
                this.entitiesManager.getEntityCount(EntityType.Enemy) === 0) {
                this.waveState = WaveState.Completed;
                this.notifyWaveStateChanged();
                this.proceedAfterCompletion();
            }
        }
    }

    /**
     * ウェーブが進行中か？
     */
    public isWaveRunning(): boolean {
        const waveInProgress = !this.isEnemySpawningFinished();
        const hasLivingEnemies = this.entitiesManager.getEntityCount(EntityType.Enemy) > 0;
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
            EnemyParameterTable.getAttackCooltime(enemyType, level),
            EnemyParameterTable.getDefense(enemyType, level),
            EnemyParameterTable.getSpeed(enemyType, level),
            EnemyParameterTable.getRange(enemyType, level)
        );

        this.entitiesManager.addEntity(enemy);
    }
}