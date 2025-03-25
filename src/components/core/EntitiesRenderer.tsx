import { JSX, useState, useEffect } from "react";
import { MemoizedPlayerBaseRenderer } from "../entities/PlayerBaseRenderer";
import { MemoizedEnemyBaseRenderer } from "../entities/EnemyBaseRenderer";
import { MemoizedEnemyRenderer } from "../entities/EnemyRenderer";
import { MemoizedTowerRenderer } from "../entities/TowerRenderer";
import { GameManager } from "../../game/core/GameManager";
import { EntitiesState } from "../../game/entities/EntitiesState";

import "../../css/core/EntitiesRenderer.css"

/**
 * エンティティの描画を行う関数コンポーネント
 * @returns 
 */
export function EntitiesRenderer(): JSX.Element {
    const entitiesManager = GameManager.getInstance().entitiesManager;
    const [entitiesState, setEntitiesState] = useState<EntitiesState>(entitiesManager!.getState());

    useEffect(() => {
        const updateState = () => {
            setEntitiesState(entitiesManager!.getState());
        }

        entitiesManager?.addOnChangedListener(updateState);

        return () => {
            entitiesManager?.removeOnChangedListener(updateState);
        }
    }, [entitiesManager]);

    return (
        <div className="entities-renderer">
            {entitiesState.playerBase && (<MemoizedPlayerBaseRenderer state={entitiesState.playerBase} />)}
            {entitiesState.enemyBase && (<MemoizedEnemyBaseRenderer state={entitiesState.enemyBase} />)}
            {entitiesState.towers.map((tower) => (
                <MemoizedTowerRenderer key={tower.id} state={tower} />
            ))}
            {entitiesState.enemies.map((enemy) => (
                <MemoizedEnemyRenderer key={enemy.id} state={enemy} />
            ))}
        </div>
    );
}