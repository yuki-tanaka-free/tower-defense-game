import React from "react";
import { PlayerBaseState } from "../../game/entities/bases/player-base/PlayerBaseState";
import { EntityRenderer } from "./EntityRenderer";

interface PlayerBaseRendererProps {
    state: PlayerBaseState;
}

export const PlayerBaseRenderer: React.FC<PlayerBaseRendererProps> = React.memo(({ state }) => {
    return (
        <EntityRenderer state={state} color="green">
            HP: {state.hp}
        </EntityRenderer>
    );
}, (prev, next) => {
    return prev.state.hp === next.state.hp;
});