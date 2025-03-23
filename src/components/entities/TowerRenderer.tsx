import React from "react";
import { TowerState } from "../../game/entities/towers/TowerState";
import { EntityRenderer } from "./EntityRenderer";

interface TowerRendererProps {
    state: TowerState
}

export const TowerRenderer: React.FC<TowerRendererProps> = React.memo(({ state }) => {
    return (
        <EntityRenderer state={ state } color = "yellow">
            Level: {state.level}
        </EntityRenderer>
    )
}, (prev, next) => {
    return prev.state.level === next.state.level;
});