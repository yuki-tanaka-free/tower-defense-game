import { JSX, useEffect, useState } from "react";
import { GameManager } from "../../game/core/GameManager";
import { WaveState } from "../../game/wave/WaveState";
import { GameLifecycleState } from "../../game/core/GamelifecycleState";
import { WaveManager } from "../../game/wave/WaveManager";
import "../../css/uis/WaveControlRenderer.css"

interface WaveControlRendererProps {
    gameState: GameLifecycleState
}

export function WaveControlRenderer({ gameState }: WaveControlRendererProps): JSX.Element | null {
    const gameManager = GameManager.getInstance();

    const [waveManager, setWaveManager] = useState<WaveManager | null>(null);
    const [autoStart, setAutoStart] = useState(false);
    const [waveState, setWaveState] = useState<WaveState>(WaveState.Preparing);
    const [remainingTime, setRemainingTime] = useState<number>(0);

    // 初期化チェック
    useEffect(() => {
        const wm = gameManager.waveManager;
        if (wm) {
            setWaveManager(wm);
            setAutoStart(wm.getAutoStartEnabled());
            setWaveState(wm.getWaveState());
            setRemainingTime(wm.getRemainingPreparationTime());
            return;
        }

        const check = setInterval(() => {
            const wm = GameManager.getInstance().waveManager;
            if (wm) {
                setWaveManager(wm);
                setAutoStart(wm.getAutoStartEnabled());
                setWaveState(wm.getWaveState());
                setRemainingTime(wm.getRemainingPreparationTime());
                clearInterval(check);
            }
        }, 100);

        return () => clearInterval(check);
    }, []);

    // イベントリスナー登録
    useEffect(() => {
        if (!waveManager) return;

        const onWaveChanged = (state: WaveState) => {
            setWaveState(state);
        };

        const handleTimeChanged = (remaining: number) => {
            setRemainingTime(remaining);
        };

        waveManager.addWaveStateChanged(onWaveChanged);
        waveManager.addPreparationTimeChanged(handleTimeChanged);

        return () => {
            waveManager.removeWaveStateChanged(onWaveChanged);
            waveManager.removePreparationTimeChanged(handleTimeChanged);
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

    const isAlreadyWaveState = waveState === WaveState.Preparing || waveState === WaveState.Already;

    // ウェーブ準備中もしくはゲーム開始前は表示しない
    if (!waveManager || !isAlreadyWaveState || gameState === GameLifecycleState.NotStarted) {
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