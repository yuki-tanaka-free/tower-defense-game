import { CircleCollider, ColliderType } from "../collision/CircleCollider";
import { Vector2 } from "../math/Vector2";
import { EntityState } from "./EntityState";
import { EntityType } from "./EntityType";

export abstract class Entity<T extends EntityState> {
    private _id: string = ""; // 一意のID
    private _isDirty: boolean = true; // 更新フラグ
    private _cachedState: T | null = null; // 描画に使用する状態のキャッシュ
    public colliders: CircleCollider[] = []; // 円形コリジョン

    constructor(
        private _position: Vector2 // 座標
    ) {
        this._id = crypto.randomUUID();
    }

    /**
     * 一意なIDを取得
     */
    public get id(): string {
        return this._id;
    }
    
    /**
     * 座標を取得
     */
    public get position(): Vector2 {
        return this._position;
    }

    /**
     * エンティティの種類を取得
     */
    public abstract get getEntityType(): EntityType;

    /**
     * 座標に変更があった時は座標を変更し更新フラグを建てる
     */
    public set position(pos: Vector2) {
        if (!this._position.equals(pos)) {
            this.colliders.forEach(c => c.updatePosition(this.position));
            this._position = pos;
            this.markDirty();
        }
    }

    /**
     * コライダーを追加
     * @param radius 
     */
    public addCollider(radius: number, colliderType: ColliderType): void {
        this.colliders.push(new CircleCollider(this.position, radius, colliderType));
    }

    /**
     * 更新があったことを記録
     */
    protected markDirty(): void {
        this._isDirty = true;
    }

    /**
     * 更新があったかを返す
     */
    public get isDirty(): boolean {
        return this._isDirty;
    }

    /**
     * 状態をキャッシュし、変更された時のみ再生成
     * @param buildState 
     * @returns 
     */
    protected getCachedState(buildState: () => T): T {
        if (this._isDirty || !this._cachedState) {
            this._cachedState = buildState();
            this._isDirty = false;
        }
        return this._cachedState;
    }

    /**
     * 更新処理
     */
    public abstract update(deltaTime: number): void;

    /**
     * 当たり判定後に呼ばれる更新処理
     */
    public abstract lateUpdate(deltaTime: number): void;

    /**
     * 死亡時処理
     */
    public abstract destroy(): void;

    /**
     * なにかに当たっている時呼ばれる
     * @param other 
     */
    public onCollisionStay?(
        _other: Entity<EntityState>, 
        _otherColliderType: ColliderType, 
        _selfColliderType: ColliderType,
    ): void {}

    /**
     * 描画に必要な情報を渡す
     */
    public abstract getState(): T;
}