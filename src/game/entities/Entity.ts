import { Vector2 } from "../math/Vector2";

export abstract class Entity {
    constructor(
        protected _position: Vector2 // 座標
    ) {}

    public get position(): Vector2 {
        return this._position;
    }

    /**
     * 行動を起こす
     */
    public abstract action(): void;
}