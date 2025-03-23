import { EntityState } from "../EntityState";
import { EnemyType } from "./EnemyType";

/**
 * エネミーの描画に使用する情報
 */
export interface EnemyState extends EntityState {
    enemyType: EnemyType;
    hp: number;
}