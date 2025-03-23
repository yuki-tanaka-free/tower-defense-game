import { MapChipType } from "../map/MapChipType";
import { MapManager } from "../map/MapManager";
import { EnemyBaseEntity } from "./bases/enemy-base/EnemyBaseEntity";
import { PlayerBaseEntity } from "./bases/player-base/PlayerBaseEntity";
import { EnemyEntity } from "./enemys/EnemyEntity";
import { TowerEntity } from "./towers/TowerEntity";
import { GameState } from "../core/GameState"
import { Vector2 } from "../math/Vector2";
import { EnemyState } from "./enemys/EnemyState";
import { TowerState } from "./towers/TowerState";
import { EntityState } from "./EntityState";
import { Entity } from "./Entity";
import { EntityType } from "./EntityType";
import { PlayerBaseState } from "./bases/player-base/PlayerBaseState";
import { EnemyBaseState } from "./bases/enemy-base/EnemyBaseState";

export class EntitiesManager {
    private entities: Entity<EntityState>[] = [];

    constructor(_mapManager: MapManager) {
        // 生成時にマップマネージャーの情報を元に基地を生成
        _mapManager.map.forEach(row => {
            row.forEach(chip => {
                const position = chip.position;
                switch (chip.mapChipType) {
                    case MapChipType.PlayerBase:
                        this.addEntity(new PlayerBaseEntity(position, 100));
                        break;
                    case MapChipType.EnemyBase:
                        this.addEntity(new EnemyBaseEntity(position));
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
        const enemyBase = this.entities.find(e => e.getEntityType === EntityType.EnemyBase);
        if (enemyBase) return enemyBase.position;
        console.error("エネミーの基地がありません。")
        return Vector2.zero();
    }

    /**
     * エンティティを追加する
     * @param enemy 
     */
    public addEntity(entity: Entity<EntityState>): void {
        this.entities.push(entity);
    }

    /**
     * 指定したエンティティの数を取得
     * @returns 
     */
    public getEntityCount(type: EntityType): number {
        return this.getEntitiesOfType<Entity<EntityState>>(type).length;
    }

    /**
     * 変換処理を共通化
     * @param type 
     * @returns 
     */
    private getEntitiesOfType<T extends Entity<EntityState>>(type: EntityType): T[] {
        return this.entities.filter(e => e.getEntityType === type) as T[];
    }

    /**
     * 更新処理
     * @param deltaTime 
     */
    public update(deltaTime: number) {
        for (const entity of this.entities) {
            entity.update(deltaTime);
        }

        this.entities = this.entities.filter(e => {
            if (e.getEntityType === EntityType.Enemy) {
                return (e as EnemyEntity).isAlive();
            }
            return true;
        });
    }

    /**
     * 描画で使用する情報を返す
     * @returns 
     */
    public getState(): GameState {
        let playerBase: PlayerBaseState | null = null;
        let enemyBase: EnemyBaseState | null = null;
        const enemies: EnemyState[] = [];
        const towers: TowerState[] = [];
    
        for (const e of this.entities) {
            switch (e.getEntityType) {
                case EntityType.PlayerBase:
                    playerBase = (e as PlayerBaseEntity).getState();
                    break;
                case EntityType.EnemyBase:
                    enemyBase = (e as EnemyBaseEntity).getState();
                    break;
                case EntityType.Enemy:
                    enemies.push((e as EnemyEntity).getState());
                    break;
                case EntityType.Tower:
                    towers.push((e as TowerEntity).getState());
                    break;
            }
        }
    
        return {
            playerBase,
            enemyBase,
            enemies,
            towers,
        };
    }
}