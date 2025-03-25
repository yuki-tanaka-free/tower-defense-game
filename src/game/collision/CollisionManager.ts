import { Entity } from "../entities/Entity";
import { EntityState } from "../entities/EntityState";

export class CollisionManager {
    public static checkCollisions(entities: Entity<EntityState>[]) {
        for (let i = 0; i < entities.length; i++) {
            const e1 = entities[i];
            if (!e1.collider) continue;

            for (let j = i + 1; j < entities.length; j++) {
                const e2 = entities[j];
                if (!e2.collider) continue;

                if (e1.collider.isCollidingWith(e2.collider)) {
                    e1.onCollisionStay?.(e2);
                    e2.onCollisionStay?.(e1);
                }
            }
        }
    }
}