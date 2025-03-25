import { Vector2 } from "../math/Vector2";

export enum ColliderType {
    Hitbox,
    Attack
}

export class CircleCollider {
    constructor(
        public center: Vector2,
        public radius: number,
        public type: ColliderType
    ){}

    /**
     * 他の円との重なり判定
     */
    public isCollidingWith(other: CircleCollider): boolean {
        return this.center.distance(other.center) <= (this.radius + other.radius);
    }

    /**
     * コライダー位置を更新
     */
    public updatePosition(position: Vector2): void {
        this.center = position;
    }
}