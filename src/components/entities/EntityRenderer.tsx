import React from "react"
import { EntityState } from "../../game/entities/EntityState"
import { GameSettings } from "../settings/GameSettings";
import "../../css/entities/EntitiyRenderer.css"

interface EntityRendererProps {
    state: EntityState;
    size?: number;
    color?: string;
    borderRadius?: string;
    children?: React.ReactNode;
}

export const EntityRenderer: React.FC<EntityRendererProps> = ({
    state,
    size = GameSettings.TILE_SIZE * 0.8,
    color = "white",
    borderRadius = "0%",
    children,
}) => {
    const offset = (GameSettings.TILE_SIZE - size) / 2;

    return (
        <div
            className="entity-renderer"
            style={{
                left: state.position.x * GameSettings.TILE_SIZE + offset,
                top: state.position.y * GameSettings.TILE_SIZE + offset,
                width: size,
                height: size,
                backgroundColor: color,
                borderRadius: borderRadius,
            }}
        >
            {children}
        </div>
    );
};
