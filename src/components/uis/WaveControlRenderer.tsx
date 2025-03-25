import { JSX, useEffect, useState } from "react";
import { GameManager } from "../../game/core/GameManager";
import { WaveState } from "../../game/wave/WaveState";
import { GameLifecycleState } from "../../game/core/GamelifecycleState";
import "../../css/uis/WaveControlRenderer.css"

export function WaveControlRenderer(): JSX.Element | null {
    const gameManager = GameManager.getInstance();
    const waveManager = gameManager.waveManager;

    // 初期値は null 安全を考慮
    const [autoStart, setAutoStart] = useState(() => waveManager?.getAutoStartEnabled() ?? false);
    const [waveState, setWaveState] = useState(() => waveManager?.getWaveState() ?? WaveState.Preparing);
    const [gameState, setGameState] = useState(gameManager.getLifecycleState());

    const [remainingTime, setRemainingTime] = useState<number>(waveManager?.getRemainingPreparationTime() ?? 0);

    useEffect(() => {
        if (!waveManager) return;

        setAutoStart(waveManager.getAutoStartEnabled());
        setWaveState(waveManager.getWaveState());

        const onWaveChanged = (state: WaveState) => {
            setWaveState(state);
        }

        const onGameChanged = (state: GameLifecycleState) => {
            setGameState(state);
        }

        const handleTimeChanged = (remaining: number) => {
            setRemainingTime(remaining);
        }

        waveManager.addWaveStateChanged(onWaveChanged);
        waveManager.addPreparationTimeChanged(handleTimeChanged);
        gameManager.addGameStateChanged(onGameChanged);

        return () => {
            waveManager.removeWaveStateChanged(onWaveChanged);
            waveManager.removePreparationTimeChanged(handleTimeChanged);
            gameManager.removeGameStateChanged(onGameChanged);
        };
    }, [waveManager]);

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        waveManager?.setAutoStartEnabled(checked);
        setAutoStart(checked);
    };

    const handleStartWave = () => {
        waveManager?.startNextWave();
    };

    // ウェーブ準備中もしくはゲーム開始前は表示しない
    if (!waveManager || waveState !== WaveState.Preparing || gameState === GameLifecycleState.NotStarted) {
        return null;
    }

    // 一時停止中か？
    const isPaused = gameManager.isGamePaused();

    return (
        <div className="wave-control-renderer">
            <label>
                <input
                    type="checkbox"
                    checked={autoStart}
                    onChange={handleToggle}
                />
                自動でウェーブ開始
            </label>

            <div className="preparation-timer">
                準備時間: {remainingTime} 秒
            </div>

            {!autoStart && (
                <button onClick={handleStartWave} disabled={isPaused}>
                    ウェーブ開始
                </button>
            )}
        </div>
    )
};