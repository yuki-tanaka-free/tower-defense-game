import { memo, JSX } from "react";
import { TowerState } from "../../game/entities/tower/TowerState";
import { EntityRenderer } from "./EntityRenderer";
import { TowerType } from "../../game/entities/tower/TowerEntity";

interface TowerRendererProps {
    state: TowerState
}

/**
 * タワー描画コンポーネント
 * @param param0 
 * @returns 
 */
function TowerRenderer({ state }: TowerRendererProps): JSX.Element {
    return (
        <EntityRenderer state={ state } color={ TowerTypeToColor(state.towerType) }>
            Level: {state.level}
        </EntityRenderer>
    );
}

/**
 * コンポーネントの再描画条件
 * @param prev
 * @param next
 * @returns 
 */
function areEqual(prev: TowerRendererProps, next: TowerRendererProps): boolean {
    return prev.state.level === next.state.level;
}

/**
 * タワーの色
 * @param towerType 
 * @returns 
 */
function TowerTypeToColor(towerType: TowerType): string {
    switch(towerType)
    {
        case TowerType.Normal:
            return "yellow";
        case TowerType.DefenseDown:
            return "orange";
        case TowerType.SpeedDown:
            return "blue";
    }
}

export const MemoizedTowerRenderer = memo(TowerRenderer, areEqual);