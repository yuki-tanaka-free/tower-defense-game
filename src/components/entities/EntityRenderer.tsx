import { EntityState } from "../../game/entities/EntityState"
import { GameSettings } from "../../game/settings/GameSettings";
import "../../css/entities/EntitiyRenderer.css"
import { JSX, ReactNode } from "react";

interface EntityRendererProps {
    state: EntityState;
    size?: number;
    color?: string;
    borderRadius?: string;
    children?: ReactNode;
    onClick?: () => void;
}

export function EntityRenderer({
    state,
    size = GameSettings.TILE_SIZE * 0.8,
    color = "white",
    borderRadius = "0%",
    children,
    onClick,
}: EntityRendererProps): JSX.Element {
    const offset = (GameSettings.TILE_SIZE - size) / 2;

    return (
        <div
            className="entity-renderer"
            onClick={onClick}
            style={{
                left: state.position.x * GameSettings.TILE_SIZE + offset,
                top: state.position.y * GameSettings.TILE_SIZE + offset,
                width: size,
                height: size,
                backgroundColor: color,
                borderRadius: borderRadius,
                pointerEvents: onClick ? "auto" : "none"
            }}
        >
            {children}
        </div>
    );
};
