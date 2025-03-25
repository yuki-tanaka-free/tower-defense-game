import { EnemyBaseState } from "./bases/enemy-base/EnemyBaseState";
import { PlayerBaseState } from "./bases/player-base/PlayerBaseState";
import { EnemyState } from "./enemy/EnemyState";
import { TowerState } from "./tower/TowerState";

export interface EntitiesState {
    playerBase: PlayerBaseState | null;
    enemyBase: EnemyBaseState | null;
    enemies: EnemyState[];
    towers: TowerState[];
}

export class EntitiesStateUtil {
    static hasChanged(prev: EntitiesState | null, next: EntitiesState): boolean {
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