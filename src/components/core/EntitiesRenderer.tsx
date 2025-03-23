import React from "react";
import { GameState } from "../../game/core/GameState"
import { PlayerBaseRenderer } from "../entities/PlayerBaseRenderer";
import { EnemyBaseRenderer } from "../entities/EnemyBaseRenderer";
import { EnemyRenderer } from "../entities/EnemyRenderer";
import "../../css/core/EntitiesRenderer.css"

interface EntitiesRendererProps {
    gameState: GameState;
}

/**
 * エンティティの描画を行う関数コンポーネント
 * @returns 
 */
export const EntitiesRenderer: React.FC<EntitiesRendererProps> = ({ gameState }) => {
    return (
        <div className="entities-renderer">
            {gameState.playerBase && (<PlayerBaseRenderer key={gameState.playerBase.id} state={gameState.playerBase} />)}
            {gameState.enemyBase && (<EnemyBaseRenderer key={gameState.enemyBase.id} state={gameState.enemyBase} />)}
            {gameState.enemies.map((enemy) => (
                <EnemyRenderer key={enemy.id} state={enemy} />
            ))}
        </div>
    )
}