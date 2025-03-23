import { Vector2 } from "../math/Vector2";

/**
 * すべてのエンティティの描画用情報の親インターフェース
 */
export interface EntityState {
    id: string; // 一意なID
    position: Vector2;
}