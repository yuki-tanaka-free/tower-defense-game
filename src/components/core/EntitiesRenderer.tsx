import React from "react";
import { GameState } from "../../game/core/GameState"
import { PlayerBaseRenderer } from "../entities/PlayerBaseRenderer";
import { EnemyBaseRenderer } from "../entities/EnemyBaseRenderer";
import { EnemyRenderer } from "../entities/EnemyRenderer";
import { TowerRenderer } from "../entities/TowerRenderer";
import "../../css/core/EntitiesRenderer.css"

interface EntitiesRendererProps {
    gameState: GameState;
}

/**
 * エンティティの描画を行う関数コンポーネント
 * @returns 
 */
export const EntitiesRenderer = React.memo(({ gameState }: EntitiesRendererProps) => {
        return (
            <div className="entities-renderer">
                {gameState.playerBase && (<PlayerBaseRenderer state={gameState.playerBase} />)}
                {gameState.enemyBase && (<EnemyBaseRenderer state={gameState.enemyBase} />)}
                {gameState.towers.map((tower) => (
                    <TowerRenderer key={tower.id} state={tower} />
                ))}
                {gameState.enemies.map((enemy) => (
                    <EnemyRenderer key={enemy.id} state={enemy} />
                ))}
            </div>
        );
    },
    (prevProps, nextProps) => {
        // gameStateが変わっていなければ再描画しない
        return (
            prevProps.gameState.playerBase === nextProps.gameState.playerBase &&
            prevProps.gameState.enemyBase === nextProps.gameState.enemyBase &&
            prevProps.gameState.enemies === nextProps.gameState.enemies &&
            prevProps.gameState.towers === nextProps.gameState.towers
        );
    }
);