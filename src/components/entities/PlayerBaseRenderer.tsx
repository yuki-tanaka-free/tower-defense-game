import { memo, JSX } from "react";
import { PlayerBaseState } from "../../game/entities/bases/player-base/PlayerBaseState";
import { EntityRenderer } from "./EntityRenderer";

interface PlayerBaseRendererProps {
    state: PlayerBaseState;
}

function PlayerBaseRenderer({ state }: PlayerBaseRendererProps): JSX.Element {
    return (
        <EntityRenderer state={state} color="green">
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
function areEqual(prev: PlayerBaseRendererProps, next: PlayerBaseRendererProps): boolean {
    return prev.state.hp === next.state.hp;
}

export const MemoizedPlayerBaseRenderer = memo(PlayerBaseRenderer, areEqual);