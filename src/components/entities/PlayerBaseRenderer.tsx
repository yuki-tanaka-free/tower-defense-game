import React from "react";
import { PlayerBaseState } from "../../game/entities/bases/player-base/PlayerBaseState";
import { EntityRenderer } from "./EntityRenderer";

interface PlayerBaseRendererProps {
    state: PlayerBaseState;
}

export const PlayerBaseRenderer: React.FC<PlayerBaseRendererProps> = ({ state }) => {
    return (
        <EntityRenderer key={state.id} state={state} color="green">
            HP: {state.hp}
        </EntityRenderer>
    )
}