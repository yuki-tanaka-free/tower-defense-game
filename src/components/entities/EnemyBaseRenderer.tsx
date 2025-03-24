import { memo, JSX } from "react";
import { EntityRenderer } from "./EntityRenderer";
import { EnemyBaseState } from "../../game/entities/bases/enemy-base/EnemyBaseState";

interface EnemyBaseRendererProps {
    state: EnemyBaseState;
}

function EnemyBaseRenderer({ state }: EnemyBaseRendererProps): JSX.Element {
    return (
        <EntityRenderer state={state} color="red">
        </EntityRenderer>
    )
}

export const MemoizedEnemyBaseRenderer = memo(EnemyBaseRenderer);