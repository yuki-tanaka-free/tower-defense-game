import { EnemyType } from "../entities/enemy/EnemyType";

/**
 * ウェーブ登録用の敵タイプ
 */
export interface EnemySpawnData {
    enemyType: EnemyType; // エネミーの種類
    level: number; // レベル
    spawnSecond: number; // 生成する時間
}