import { JSX, useEffect, useState } from "react";
import { GameManager } from "../../game/core/GameManager";
import { GameLifecycleState } from "../../game/core/GamelifecycleState";
import { WaveState } from "../../game/wave/WaveState";
import { PlayerState } from "../../game/player/PlayerState";
import { WaveManager } from "../../game/wave/WaveManager";
import { Player } from "../../game/player/Player";

interface GameStatusRendererProps {
    gameState: GameLifecycleState
}

export function GameStatusRenderer({ gameState }: GameStatusRendererProps): JSX.Element | null {
    const [waveManager, setWaveManager] = useState<WaveManager | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [_, setWaveState] = useState<WaveState>(WaveState.Preparing);
    const [playerState, setPlayerState] = useState<PlayerState | undefined>();

    useEffect(() => {
        const gm = GameManager.getInstance();

        if (gm.waveManager && gm.player) {
            setWaveManager(gm.waveManager);
            setPlayer(gm.player);
            setWaveState(gm.waveManager.getWaveState());
            setPlayerState(gm.player.getState());
            return;
        }

        const check = setInterval(() => {
            const wm = GameManager.getInstance().waveManager;
            const p = GameManager.getInstance().player;
            if (wm && p) {
                setWaveManager(wm);
                setPlayer(p);
                setWaveState(wm.getWaveState());
                setPlayerState(p.getState());
                clearInterval(check);
            }
        }, 100);

        return () => clearInterval(check);
    }, []);

    useEffect(() => {
        if (!waveManager || !player) return;

        const onWaveChanged = (state: WaveState) => {
            setWaveState(state);
        };

        const onPlayerChanged = (state: PlayerState) => {
            setPlayerState(state);
        };

        waveManager.addWaveStateChanged(onWaveChanged);
        player.addOnChangedListener(onPlayerChanged);

        return () => {
            waveManager.removeWaveStateChanged(onWaveChanged);
            player.removeOnChangedListener(onPlayerChanged);
        };
    }, [waveManager, player]);
    
    // 条件が揃わない時は描画しない
    if (!waveManager || !player || gameState === GameLifecycleState.NotStarted) return null;

    return (
        <div>
            {"現在のウェーブ：" + waveManager.getCurrentWave()}<br />
            {"プレイヤーの所持金：" + playerState?.money}
        </div>
    )
}