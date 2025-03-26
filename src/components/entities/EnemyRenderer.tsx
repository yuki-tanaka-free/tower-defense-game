import { memo, JSX } from "react";
import { EnemyState } from "../../game/entities/enemy/EnemyState";
import { EntityRenderer } from "./EntityRenderer";
import "../../css/entities/EnemyRenderer.css"

interface EnemyRendererProps {
    state: EnemyState;
}

function EnemyRenderer({ state }: EnemyRendererProps): JSX.Element {
    const effects: JSX.Element[] = [];

    if (state.isDamaged) {
        effects.push(<div key="damage" className="enemy-effect-damage" />);
    }
    if (state.isSlowed) {
        effects.push(<div key="slow" className="enemy-effect-slow" />);
    }
    if (state.isDefenseDown) {
        effects.push(<div key="defdown" className="enemy-effect-defense" />);
    }

    return (
        <EntityRenderer state={state} color="red">
            <div className="enemy-effect-container">
                {effects}
            </div>
            HP: {state.hp}
        </EntityRenderer>
    );
}

/**
 * コンポーネントの再描画条件
 * @param prev
 * @param next
 * @returns 
 */
function areEqual(prev: EnemyRendererProps, next: EnemyRendererProps): boolean {
    return (
        prev.state.hp === next.state.hp &&
        prev.state.position.x === next.state.position.x &&
        prev.state.position.y === next.state.position.y &&
        prev.state.isDamaged === next.state.isDamaged &&
        prev.state.isSlowed === next.state.isSlowed &&
        prev.state.isDefenseDown === next.state.isDefenseDown
    );
}

export const MemoizedEnemyRenderer = memo(EnemyRenderer, areEqual);