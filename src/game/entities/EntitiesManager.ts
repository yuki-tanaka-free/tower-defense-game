import { MapChipType } from "../map/MapChipType";
import { MapManager } from "../map/MapManager";
import { EnemyBaseEntity } from "./bases/enemy-base/EnemyBaseEntity";
import { PlayerBaseEntity } from "./bases/player-base/PlayerBaseEntity";
import { EnemyEntity } from "./enemy/EnemyEntity";
import { TowerEntity } from "./tower/TowerEntity";
import { EntitiesState } from "./EntitiesState";
import { Vector2 } from "../math/Vector2";
import { EnemyState } from "./enemy/EnemyState";
import { TowerState } from "./tower/TowerState";
import { EntityState } from "./EntityState";
import { Entity } from "./Entity";
import { EntityType } from "./EntityType";
import { PlayerBaseState } from "./bases/player-base/PlayerBaseState";
import { EnemyBaseState } from "./bases/enemy-base/EnemyBaseState";
import { CollisionManager } from "../collision/CollisionManager";

export class EntitiesManager {
    private entities: Entity<EntityState>[] = [];
    private changedListeners = new Set<() => void>();

    constructor(_mapManager: MapManager) {
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
     * エネミーのスポーン場所を取得
     * @returns 
     */
    public getEnemySpawnPosition(): Vector2 {
        const enemyBase = this.entities.find(e => e.getEntityType === EntityType.EnemyBase);
        if (enemyBase) return enemyBase.position;
        console.error("エネミーの基地がありません。");
        return Vector2.zero();
    }

    /**
     * エンティティを追加
     * @param entity 
     */
    public addEntity(entity: Entity<EntityState>): void {
        this.entities.push(entity);
        this.notifyChanged(); // エンティティの追加時にも通知
    }

    /**
     * エンティティを削除
     * @param entity 
     */
    public removeEntity(entity: Entity<EntityState>): void {
        const index = this.entities.indexOf(entity);
        if (index >= 0) {
            this.entities[index].destroy();
            this.entities.splice(index, 1);
            this.notifyChanged(); // エンティティの削除時にも通知
        }
    }

    /**
     * エンティティに変化があった時呼ばれるイベントを追加
     * @param listener 
     */
    public addOnChangedListener(listener: () => void): void {
        this.changedListeners.add(listener);
    }

    /**
     * エンティティに変化があった時呼ばれるイベントを削除
     * @param listener 
     */
    public removeOnChangedListener(listener: () => void): void {
        this.changedListeners.delete(listener);
    }

    /**
     * エンティティに変化があった時呼ばれるイベントに通知
     */
    private notifyChanged(): void {
        this.changedListeners.forEach(listener => listener());
    }

    /**
     * 指定したエンティティの現在の数を取得
     * @param type 
     * @returns 
     */
    public getEntityCount(type: EntityType): number {
        return this.getEntitiesOfType<Entity<EntityState>>(type).length;
    }

    /**
     * 指定したエンティティの配列を返す
     * @param type 
     * @returns 
     */
    private getEntitiesOfType<T extends Entity<EntityState>>(type: EntityType): T[] {
        return this.entities.filter(e => e.getEntityType === type) as T[];
    }

    /**
     * 更新処理（状態が変更されたときのみ通知）
     */
    public update(deltaTime: number): void {
        let hasAnyEntityChanged = false;

        for (const entity of this.entities) {
            entity.update(deltaTime);

            if (entity.isDirty) {
                hasAnyEntityChanged = true;
            }
        }

        // 当たり判定
        CollisionManager.checkCollisions(this.entities);

        // 死亡した敵を removeEntity 経由で削除（内部で notifyChanged() が走る）
        for (const enemy of this.getEntitiesOfType<EnemyEntity>(EntityType.Enemy)) {
            if (!enemy.isAlive()) {
                this.removeEntity(enemy);
                hasAnyEntityChanged = true; // 念のため明示
            }
        }

        // 少なくとも1体でも変更があった場合のみ通知
        if (hasAnyEntityChanged) {
            this.notifyChanged();
        }
    }

    /**
     * 各種エンティティの情報を返す
     * @returns 
     */
    public getState(): EntitiesState {
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
