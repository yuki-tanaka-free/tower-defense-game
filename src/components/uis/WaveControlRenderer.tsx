import React from "react";
import { GameManager } from "../../game/core/GameManager";
import "../../css/uis/WaveControlRenderer.css"

export const WaveControlRenderer: React.FC = () => {
    const gameManager = GameManager.getInstance();
    const waveManager = gameManager.waveManager;
    // const [isPaused, setPaused] = useState(false);

    // ウェーブの手動開始
    const handleStartWave = () => {
        waveManager?.startNextWave();
    }

    // const handleTogglePause = () => {
    //     if (isPaused) {
    //         gameManager.resume();
    //     }
    //     else {
    //         gameManager.stop(); // 一時停止
    //     }

    //     setPaused(!isPaused);
    // }

    return (
        <div className="wave-control-renderer">
            {!waveManager?.isWaveRunning() && (
                <button onClick={handleStartWave}>ウェーブ開始</button>
            )}
        </div>
    )
};