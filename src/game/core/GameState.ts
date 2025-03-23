import { EnemyBaseState } from "../entities/bases/enemy-base/EnemyBaseState";
import { PlayerBaseState } from "../entities/bases/player-base/PlayerBaseState";
import { EnemyState } from "../entities/enemys/EnemyState";
import { TowerState } from "../entities/towers/TowerState";

export interface GameState {
    playerBase: PlayerBaseState | null;
    enemyBase: EnemyBaseState | null;
    enemies: EnemyState[];
    towers: TowerState[];
}