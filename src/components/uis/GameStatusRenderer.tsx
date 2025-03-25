import { JSX, useEffect, useState } from "react";
import { GameManager } from "../../game/core/GameManager";
import { GameLifecycleState } from "../../game/core/GamelifecycleState";
import { WaveState } from "../../game/wave/WaveState";
import { PlayerState } from "../../game/player/PlayerState";

export function GameStatusRenderer(): JSX.Element | null {
    const gameManager = GameManager.getInstance();
    const waveManager = gameManager.waveManager
    const player = gameManager.player;

    const [gameState, setGameState] = useState(gameManager.getLifecycleState());
    const [_, setWaveState] = useState(() => waveManager?.getWaveState() ?? WaveState.Preparing);
    const [playerState, setPlayerState] = useState(player?.getState());

    useEffect(() => {
        if (!waveManager || !player) return;

        setWaveState(waveManager.getWaveState());

        const onGameChanged = (state: GameLifecycleState) => {
            setGameState(state);
        }

        const onWaveChanged = (state: WaveState) => {
            setWaveState(state);
        }

        const onPlayerChanged = (state: PlayerState) => {
            setPlayerState(state);
        }

        gameManager.addGameStateChanged(onGameChanged);
        waveManager.addWaveStateChanged(onWaveChanged);
        player.addOnChangedListener(onPlayerChanged);
    }, [waveManager, player]);
    
    // 条件が揃わない時は描画しない
    if (!player || !waveManager || gameState === GameLifecycleState.NotStarted) return null;

    return (
        <div>
            {"現在のウェーブ：" + waveManager.getCurrentWave()}<br />
            {"プレイヤーの所持金：" + playerState?.money}
        </div>
    )
}