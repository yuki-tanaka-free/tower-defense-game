import { EnemyParameterTable } from "../entities/enemy/EnemyParameterTable";
import { EntitiesManager } from "../entities/EntitiesManager";
import { MapManager } from "../map/MapManager";
import { WaveManager } from "../wave/WaveManager";
import { GameState, GameStateUtil } from "./GameState";

export class GameManager {
    private static _instance: GameManager | null = null;

    private _mapManager: MapManager | null = null;
    private _waveManager: WaveManager | null = null;
    private _entityManager: EntitiesManager | null = null;
    
    private lastTime: number = 0;
    private isRunning: boolean = false;
    private updateCallback: ((state: GameState) => void) | null = null;
    private initialized: boolean = false;

    private prevState: GameState | null = null;

    private constructor() {}

    /**
     * インスタンス取得
     * @returns 
     */
    public static getInstance(): GameManager {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    /**
     * 初期化
     * @param updateCallback 
     * @returns 
     */
    public async init(updateCallback: (state: GameState) => void): Promise<void> {
        if (this.initialized) return;

        // マップの生成
        this._mapManager = new MapManager();
        await this._mapManager.loadMap();

        // エンティティの生成
        this._entityManager = new EntitiesManager(this._mapManager);

        // 敵のパラメータをロード
        await EnemyParameterTable.load();

        // ウェーブの生成
        this._waveManager = new WaveManager(this._mapManager, this._entityManager);
        await this._waveManager.init();

        this.lastTime = performance.now();
        this.isRunning = false;
        this.updateCallback = updateCallback;
        this.initialized = true;
        this.prevState = this._entityManager.getState();
    }

    /**
     * マップマネージャー
     */
    public get mapManager(): MapManager | null {
        return this._mapManager
    }

    /**
     * ウェーブマネージャー
     */
    public get waveManager(): WaveManager | null {
        return this._waveManager;
    }

    /**
     * エンティティマネージャー
     */
    public get entityManager(): EntitiesManager | null {
        return this._entityManager;
    }

    /**
     * ゲームループ開始
     */
    public start() {
        this.isRunning = true;
        requestAnimationFrame(this.gameLoop);
    }

    /**
     * ゲーム再開
     */
    public resume() {
        this.isRunning = true;
    }

    /**
     * ゲームの停止
     */
    public stop() {
        this.isRunning = false;
    }

    /**
     * ゲームループ
     * @param currentTime
     * @returns 
     */
    private gameLoop = (currentTime: number) => {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (this._waveManager) {
            this._waveManager.update(deltaTime);
        }

        if (this._entityManager) {
            this._entityManager.update(deltaTime);

            // 状態更新の通知
            if (this.updateCallback) {
                const newState = this._entityManager.getState();

                // 変更があれば画面に更新を通知
                if (GameStateUtil.hasChanged(this.prevState, newState)) {
                    this.prevState = newState;
                    this.updateCallback(newState);
                }
            }
        }

        requestAnimationFrame(this.gameLoop);
    }
}