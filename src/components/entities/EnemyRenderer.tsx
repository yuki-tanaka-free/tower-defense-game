import React from "react";
import { EnemyState } from "../../game/entities/enemys/EnemyState";
import { EntityRenderer } from "./EntityRenderer";

interface EnemyRendererProps {
    state: EnemyState;
}

export const EnemyRenderer: React.FC<EnemyRendererProps> = React.memo(({ state }) => {
    return (
        <EntityRenderer state={state} color="red">
            HP: {state.hp}
        </EntityRenderer>
    );
}, (prev, next) => {
    return (
        prev.state.hp === next.state.hp &&
        prev.state.position.x === next.state.position.x &&
        prev.state.position.y === next.state.position.y
    );
});