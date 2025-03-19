/**
 * マップチップの種類
 */
export enum MapChipType {
    None, // 空のマップチップ（空白）
    PlayerBase, // プレイヤーの基地（P）
    EnemyBase, // エネミーの基地（E）
    Mountain, // 山（M）
    Sea, // 海（S）
    Tower, // タワーが置ける場所（T）
    EnemyRoute, // エネミーの経路（R）
}