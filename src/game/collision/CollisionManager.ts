import { Entity } from "../entities/Entity";
import { EntityState } from "../entities/EntityState";
import { GameSettings } from "../settings/GameSettings";
import { CircleCollider } from "./CircleCollider";

export class CollisionManager {
    /**
     * コライダーの radius に応じて、自分＋周囲のチェックマスを返す
     */
    private static getCoveredGridKeys(collider: CircleCollider): string[] {
        // radius = 0で自分のいるマスのみ、1で3*3マス、2で5*5マス
        const range = Math.max(0, Math.floor(collider.radius));
        const gx = Math.floor(collider.center.x / GameSettings.TILE_SIZE);
        const gy = Math.floor(collider.center.y / GameSettings.TILE_SIZE);

        const keys: string[] = [];

        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                keys.push(`${gx + dx},${gy + dy}`);
            }
        }

        return keys;
    }

    /**
     * グリッドベースの効率的な当たり判定
     */
    public static checkCollisions(entities: Entity<EntityState>[]) {
        const gridMap = new Map<string, Entity<EntityState>[]>();

        // 各エンティティをグリッドマップに登録
        for (const entity of entities) {
            for (const collider of entity.colliders) {
                const keys = this.getCoveredGridKeys(collider);
                for (const key of keys) {
                    if (!gridMap.has(key)) gridMap.set(key, []);
                    gridMap.get(key)!.push(entity);
                }
            }
        }

        const checkedPairs = new Set<string>();

        for (const [_, cellEntities] of gridMap.entries()) {
            for (let i = 0; i < cellEntities.length; i++) {
                const e1 = cellEntities[i];
                for (let j = i + 1; j < cellEntities.length; j++) {
                    const e2 = cellEntities[j];
                    if (e1 === e2) continue;

                    const idKey = [e1.id, e2.id].sort().join("-");
                    if (checkedPairs.has(idKey)) continue;
                    checkedPairs.add(idKey);

                    for (const c1 of e1.colliders) {
                        for (const c2 of e2.colliders) {
                            if (c1.isCollidingWith(c2)) {
                                e1.onCollisionStay?.(e2, c2.type, c1.type);
                                e2.onCollisionStay?.(e1, c1.type, c2.type);
                            }
                        }
                    }
                }
            }
        }
    }
}