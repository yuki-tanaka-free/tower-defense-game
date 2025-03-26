export enum GameLifecycleState {
    NotStarted, // 開始前
    Running, // 進行中
    Paused, // 一時停止
    Restarting,// リスタート
    GameOver,
    GameClear,
    Stopped, // 停止中
}
