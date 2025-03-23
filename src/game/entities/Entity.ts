import { Vector2 } from "../math/Vector2";
import { EntityState } from "./EntityState";

export abstract class Entity<T extends EntityState> {
    private _id: string = "";

    constructor(
        protected _position: Vector2 // 座標
    ) {
        this._id = crypto.randomUUID();
    }

    public get id(): string {
        return this._id;
    }
    
    public get position(): Vector2 {
        return this._position;
    }

    /**
     * 更新処理
     */
    public abstract update(deltaTime: number): void;

    /**
     * 描画に必要な情報を渡す
     */
    public abstract getState(): T;
}