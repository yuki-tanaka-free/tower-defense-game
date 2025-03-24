import { memo, JSX } from "react";
import { EnemyState } from "../../game/entities/enemy/EnemyState";
import { EntityRenderer } from "./EntityRenderer";

interface EnemyRendererProps {
    state: EnemyState;
}

function EnemyRenderer({ state }: EnemyRendererProps): JSX.Element {
    return (
        <EntityRenderer state={state} color="red">
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
        prev.state.position.y === next.state.position.y
    );
}

export const MemoizedEnemyRenderer = memo(EnemyRenderer, areEqual);