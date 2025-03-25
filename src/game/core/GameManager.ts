import { EnemyParameterTable } from "../entities/enemy/EnemyParameterTable";
import { EntitiesManager } from "../entities/EntitiesManager";
import { TowerParameterTable } from "../entities/tower/TowerParameterTable";
import { MapManager } from "../map/MapManager";
import { Player } from "../player/Player";
import { WaveManager } from "../wave/WaveManager";
import { GameLifecycleState } from "./GamelifecycleState";

export class GameManager {
    private static _instance: GameManager | null = null;

    private _mapManager: MapManager | null = null;
    private _waveManager: WaveManager | null = null;
    private _entityManager: EntitiesManager | null = null;
    private _player: Player | null = null;

    private lastTime: number = 0;
    private initialized: boolean = false;

    private lifecycleState: GameLifecycleState = GameLifecycleState.NotStarted;
    private gameStateListeners: Set<(state: GameLifecycleState) => void> = new Set();

    // ゲームの状態毎に呼び出すゲームループを切り替える
    private gameLoopHandlers: Record<GameLifecycleState, (dt: number) => void> = {
        [GameLifecycleState.NotStarted]: this.noopLoop,
        [GameLifecycleState.Running]: this.runningLoop,
        [GameLifecycleState.Paused]: this.pausedLoop,
        [GameLifecycleState.Stopped]: this.noopLoop,
    }

    private constructor() { }

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
    public async init(): Promise<void> {
        if (this.initialized) return;

        // タワーのパラメータをロード
        await TowerParameterTable.load();
        // 敵のパラメータをロード
        await EnemyParameterTable.load();

        // マップの生成
        this._mapManager = new MapManager();
        await this._mapManager.loadMap();

        // エンティティの生成
        this._entityManager = new EntitiesManager(this._mapManager);

        // ウェーブの生成
        this._waveManager = new WaveManager(this._mapManager, this._entityManager);
        await this._waveManager.init();

        // プレイヤーの生成
        this._player = new Player();

        this.initialized = true;
    }

    /**
     * リスタート
     */
    public async restart(): Promise<void> {
        // 一旦停止
        this.stop();
        this.initialized = false;

        // 各種パラメータは既に読み込み完了しているため読み込まない
        // await TowerParameterTable.load();
        // await EnemyParameterTable.load();

        // マネージャーを再生成

        // マップは固定のため再生生成の必要はなし
        // this._mapManager = new MapManager();
        // await this.mapManager?.loadMap();

        this._entityManager = new EntitiesManager(this._mapManager!);

        this._waveManager = new WaveManager(this._mapManager!, this._entityManager);
        await this._waveManager.init();

        // プレイヤーの生成
        this._player = new Player();

        this.initialized = true;

        this.start();
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
    public get entitiesManager(): EntitiesManager | null {
        return this._entityManager;
    }

    public get player(): Player | null {
        return this._player;
    }

    /**
     * 現在のゲーム状態を返す
     * @returns 
     */
    public getLifecycleState(): GameLifecycleState {
        return this.lifecycleState;
    }

    private setLifecycleState(state: GameLifecycleState): void {
        if (this.getLifecycleState() !== state) {
            console.log("ゲームの状態が変化:", GameLifecycleState[this.getLifecycleState()], "→", GameLifecycleState[state]);
            this.lifecycleState = state;
            this.notifyGameStateChanged();
        }
    }

    /**
     * ゲーム状態変更時に呼ばれるイベントの追加
     * @param listener 
     */
    public addGameStateChanged(listener: (state: GameLifecycleState) => void): void {
        this.gameStateListeners.add(listener);
    }

    /**
     * ゲーム状態変更時に呼ばれるイベントの削除
     * @param listener 
     */
    public removeGameStateChanged(listener: (state: GameLifecycleState) => void): void {
        this.gameStateListeners.delete(listener);
    }

    /**
     * ゲーム状態変更を通知
     */
    private notifyGameStateChanged(): void {
        for (const listener of this.gameStateListeners) {
            listener(this.lifecycleState);
        }
    }

    /**
     * ゲームループ開始
     */
    public start() {
        this.setLifecycleState(GameLifecycleState.Running);
        this.lastTime = performance.now();

        // ウェーブの準備期間へ移行
        this._waveManager?.startPreparation();

        requestAnimationFrame(this.gameLoop);
    }

    /**
     * ゲームを一時停止
     */
    public pause() {
        this.setLifecycleState(GameLifecycleState.Paused);
    }

    /**
     * ゲーム再開
     */
    public resume() {
        this.setLifecycleState(GameLifecycleState.Running);
    }

    /**
     * 一時停止と再開を切り替え
     */
    public togglePause() {
        this.isGamePaused() ? this.resume() : this.pause();
    }

    /**
     * ゲーム進行中か？
     */
    public isGameRunning(): boolean {
        return this.lifecycleState === GameLifecycleState.Running;
    }

    /**
     * ゲームがポーズ中か？
     * @returns 
     */
    public isGamePaused(): boolean {
        return this.lifecycleState === GameLifecycleState.Paused;
    }

    /**
     * ゲームの停止
     */
    public stop() {
        if (this.lifecycleState === GameLifecycleState.Running || this.lifecycleState === GameLifecycleState.Paused) {
            this.setLifecycleState(GameLifecycleState.Stopped);
        }
    }

    /**
     * ゲーム進行中に実行されるゲームループ
     * @param dt 
     */
    private runningLoop(dt: number) {
        this._waveManager?.update(dt);
        this._entityManager?.update(dt);

        requestAnimationFrame(this.gameLoop);
    }

    /**
     * ゲーム停止中に実行されるゲームループ
     * @param _ 
     */
    private pausedLoop(_: number) {
        requestAnimationFrame(this.gameLoop); // ポーズ中はループ継続のみ
    }

    /**
     * ゲームループを実行しない
     * @param _ 
     */
    private noopLoop(_: number) {
        // なにもしない（StoppedやNotStarted時）
    }

    /**
     * ゲームループ
     * @param currentTime
     * @returns 
     */
    private gameLoop = (currentTime: number) => {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        const handler = this.gameLoopHandlers[this.lifecycleState];
        handler.call(this, deltaTime);
    }
}