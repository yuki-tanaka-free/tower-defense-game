import { memo, JSX } from "react";
import { GameState } from "../../game/core/GameState"
import { MemoizedPlayerBaseRenderer } from "../entities/PlayerBaseRenderer";
import { MemoizedEnemyBaseRenderer } from "../entities/EnemyBaseRenderer";
import { MemoizedEnemyRenderer } from "../entities/EnemyRenderer";
import { MemoizedTowerRenderer } from "../entities/TowerRenderer";
import "../../css/core/EntitiesRenderer.css"

interface EntitiesRendererProps {
    gameState: GameState;
}

/**
 * エンティティの描画を行う関数コンポーネント
 * @returns 
 */
function EntitiesRenderer({ gameState }: EntitiesRendererProps): JSX.Element {
    return (
        <div className="entities-renderer">
            {gameState.playerBase && (<MemoizedPlayerBaseRenderer state={gameState.playerBase} />)}
            {gameState.enemyBase && (<MemoizedEnemyBaseRenderer state={gameState.enemyBase} />)}
            {gameState.towers.map((tower) => (
                <MemoizedTowerRenderer key={tower.id} state={tower} />
            ))}
            {gameState.enemies.map((enemy) => (
                <MemoizedEnemyRenderer key={enemy.id} state={enemy} />
            ))}
        </div>
    );
}

/**
 * コンポーネントの再描画条件
 * @param prevProps 
 * @param nextProps 
 * @returns 
 */
function areEqual(prevProps: EntitiesRendererProps, nextProps: EntitiesRendererProps): boolean {
    // gameStateが変わっていなければ再描画しない
    return (
        prevProps.gameState.playerBase === nextProps.gameState.playerBase &&
        prevProps.gameState.enemyBase === nextProps.gameState.enemyBase &&
        prevProps.gameState.enemies === nextProps.gameState.enemies &&
        prevProps.gameState.towers === nextProps.gameState.towers
    );
}

export const MemoizedEntitiesRenderer = memo(EntitiesRenderer, areEqual);