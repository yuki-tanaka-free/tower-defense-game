import React from "react";
import { EntityRenderer } from "./EntityRenderer";
import { EnemyBaseState } from "../../game/entities/bases/enemy-base/EnemyBaseState";

interface EnemyBaseRendererProps {
    state: EnemyBaseState;
}

export const EnemyBaseRenderer: React.FC<EnemyBaseRendererProps> = ({ state }) => {
    return (
        <EntityRenderer state={state} color="red">
        </EntityRenderer>
    )
}