import { Vector2 } from "../math/Vector2";

export enum ColliderType {
    Hitbox,
    Attack
}

export class CircleCollider {
    constructor(
        public center: Vector2,
        public radius: number, // 0.5で自分のマスのみ
        public type: ColliderType
    ) {}

    /**
     * 他の円との衝突判定
     */
    public isCollidingWith(other: CircleCollider): boolean {
        const distance = this.center.distance(other.center);
        return distance <= (this.radius + other.radius);
    }

    /**
     * 座標を更新
     */
    public updatePosition(position: Vector2): void {
        this.center = position;
    }
}