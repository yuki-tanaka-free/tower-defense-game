## ゲームの流れ

1. `GameManager.init()`
    - パラメータテーブル読み込み（`TowerParameterTable`, `EnemyParameterTable`）
    - マップロード（`MapManager.loadMap()`）
    - エンティティ初期化（`EntitiesManager`）
    - ウェーブ生成（`WaveManager.init()`）
    - プレイヤー生成

2. `GameManager.start()`
    - 状態遷移 → `Running`
    - `WaveManager.startPreparation()` で準備フェーズ開始
    - `requestAnimationFrame()` によってゲームループ開始

3. ゲームループ
    - 毎フレーム：
        - `WaveManager.update()` → 敵の出現
        - `EntitiesManager.update()` → エンティティの移動・攻撃・死亡判定
    - 勝利条件：
        - 全ウェーブ完了 ＆ 敵が全滅 → `GameClear`
    - 敗北条件：
        - プレイヤー基地のHPが0 → `GameOver`