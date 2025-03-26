import { JSX, useEffect, useState } from "react";
import { GameManager } from "../../game/core/GameManager";
import { GameLifecycleState } from "../../game/core/GamelifecycleState";
import { WaveState } from "../../game/wave/WaveState";
import { PlayerState } from "../../game/player/PlayerState";

interface GameStatusRendererProps {
    gameState: GameLifecycleState
}

export function GameStatusRenderer({ gameState }: GameStatusRendererProps): JSX.Element | null {
    const gameManager = GameManager.getInstance();
    const player = gameManager.player;
    const waveManager = gameManager.waveManager;

    const [_, setWaveState] = useState<WaveState>(WaveState.Preparing);
    const [playerState, setPlayerState] = useState<PlayerState | undefined>();

    useEffect(() => {
        if (!waveManager || !player) return;

        const onWaveChanged = (state: WaveState) => setWaveState(state);
        const onPlayerChanged = (state: PlayerState) => setPlayerState(state);

        waveManager.addWaveStateChanged(onWaveChanged);
        player.addOnChangedListener(onPlayerChanged);

        // 初期値も一応入れておく
        setWaveState(waveManager.getWaveState());
        setPlayerState(player.getState());

        return () => {
            waveManager.removeWaveStateChanged(onWaveChanged);
            player.removeOnChangedListener(onPlayerChanged);
        };
    }, [waveManager, player]);
    
    if (!waveManager || !player || gameState === GameLifecycleState.NotStarted) return null;

    return (
        <div>
            {"現在のウェーブ：" + waveManager.getCurrentWave()}<br />
            {"プレイヤーの所持金：" + playerState?.money}
        </div>
    );
}