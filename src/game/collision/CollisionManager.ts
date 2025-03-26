import { Entity } from "../entities/Entity";
import { EntityState } from "../entities/EntityState";
import { ColliderType, CircleCollider } from "./CircleCollider";

export class CollisionManager {
    /**
     * 円ベースの衝突判定（総当たり＋タイプ制限あり）
     */
    public static checkCollisions(entities: Entity<EntityState>[]) {
        const checkedPairs = new Set<string>();

        for (let i = 0; i < entities.length; i++) {
            const e1 = entities[i];
            for (let j = i + 1; j < entities.length; j++) {
                const e2 = entities[j];
                const pairKey = [e1.id, e2.id].sort().join("-");
                if (checkedPairs.has(pairKey)) continue;
                checkedPairs.add(pairKey);

                for (const c1 of e1.colliders as CircleCollider[]) {
                    for (const c2 of e2.colliders as CircleCollider[]) {
                        if (!CollisionManager.shouldCheck(c1, c2)) continue;
                        if (c1.isCollidingWith(c2)) {
                            e1.onCollisionStay?.(e2, c2.type, c1.type);
                            e2.onCollisionStay?.(e1, c1.type, c2.type);
                        }
                    }
                }
            }
        }
    }

    /**
     * 当たり判定を行うべきコライダーの組み合わせか判定
     */
    private static shouldCheck(c1: CircleCollider, c2: CircleCollider): boolean {
        return (
            (c1.type === ColliderType.Attack && c2.type === ColliderType.Hitbox) ||
            (c1.type === ColliderType.Hitbox && c2.type === ColliderType.Attack) ||
            (c1.type === ColliderType.Hitbox && c2.type === ColliderType.Hitbox)
        );
    }
}