import React from "react";
import { EnemyState } from "../../game/entities/enemys/EnemyState";
import { EntityRenderer } from "./EntityRenderer";

interface EnemyRendererProps {
    state: EnemyState;
}

export const EnemyRenderer: React.FC<EnemyRendererProps> = ({ state }) => {
    return (
        <EntityRenderer state={ state } color="red">
            HP: { state.hp }
        </EntityRenderer>
    )
}