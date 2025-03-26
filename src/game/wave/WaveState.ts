export enum WaveState {
    Preparing,   // 準備時間（建物配置など）
    Already,     // 準備フェーズ終了
    Running,     // 敵出現中
    Completed,   // 全滅完了 → 報酬付与
    GameOver,    // ゲームオーバー
    GameClear,   // 全ウェーブ撃退
}