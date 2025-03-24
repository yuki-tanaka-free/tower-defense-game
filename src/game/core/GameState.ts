import { EnemyBaseState } from "../entities/bases/enemy-base/EnemyBaseState";
import { PlayerBaseState } from "../entities/bases/player-base/PlayerBaseState";
import { EnemyState } from "../entities/enemy/EnemyState";
import { TowerState } from "../entities/tower/TowerState";

export interface GameState {
    playerBase: PlayerBaseState | null;
    enemyBase: EnemyBaseState | null;
    enemies: EnemyState[];
    towers: TowerState[];
}

export class GameStateUtil {
    static hasChanged(prev: GameState | null, next: GameState): boolean {
        if (!prev) return true;

        // console.log("playerBase same?", prev.playerBase === next.playerBase)
        // console.log("enemyBase same?", prev.enemyBase === next.enemyBase);
        // console.log("enemies same?", prev.enemies === next.enemies);
        // console.log("towers same?", prev.towers === next.towers);


        return (
            prev.playerBase !== next.playerBase ||
            prev.enemyBase !== next.enemyBase ||
            prev.enemies !== next.enemies ||
            prev.towers !== next.towers
        );
    }
}