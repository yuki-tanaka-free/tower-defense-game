import { MapChipType } from "../map/MapChipType";
import { MapManager } from "../map/MapManager";
import { EnemyBaseEntity } from "./bases/enemy-base/EnemyBaseEntity";
import { PlayerBaseEntity } from "./bases/player-base/PlayerBaseEntity";
import { EnemyEntity } from "./enemys/EnemyEntity";
import { TowerEntity } from "./towers/TowerEntity";
import { GameState } from "../core/GameState"
import { Vector2 } from "../math/Vector2";

export class EntitiesManager {
    private playerBase: PlayerBaseEntity | null = null;
    private enemyBase: EnemyBaseEntity | null = null;
    private enemies: EnemyEntity[] = [];
    private towers: TowerEntity[] = [];

    constructor(_mapManager: MapManager) {
        // 生成時にマップマネージャーの情報を元に基地を生成
        _mapManager.map.forEach(row => {
            row.forEach(chip => {
                const position = chip.position;
                switch (chip.mapChipType) {
                    case MapChipType.PlayerBase:
                        this.playerBase = new PlayerBaseEntity(position, 100);
                        break;
                    case MapChipType.EnemyBase:
                        this.enemyBase = new EnemyBaseEntity(position);
                        break;
                }
            });
        });
    }

    /**
     * エネミーの生成位置を返す
     * @returns 
     */
    public getEnemySpawnPosition(): Vector2 {
        if (this.enemyBase) return this.enemyBase.position;
        console.error("エネミーの基地がありません。")
        return Vector2.zero();
    }

    /**
     * エネミーを追加する
     * @param enemy 
     */
    public addEnemy(enemy: EnemyEntity): void {
        if (!enemy) {
            console.error("無効なエネミーが渡されました");
            return;
        }

        if (!this.enemies.includes(enemy)) { // 重複登録を防止
            this.enemies.push(enemy);
        }
    }

    /**
     * エネミーの数を取得
     * @returns 
     */
    public getEnemyCount(): number {
        return this.enemies.length;
    }

    /**
     * 更新処理
     * @param deltaTime 
     */
    public update(deltaTime: number) {
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        this.enemies = this.enemies.filter(enemy => enemy.isAlive());
    }

    /**
     * 描画で使用する情報を返す
     * @returns 
     */
    public getState(): GameState {
        return {
            playerBase: this.playerBase ? this.playerBase.getState() : null,
            enemyBase: this.enemyBase ? this.enemyBase.getState() : null,
            enemies: this.enemies.map(e => e.getState()),
            towers: this.towers.map(t => t.getState()),
        };
    }
}