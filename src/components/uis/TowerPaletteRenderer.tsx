import { JSX } from "react";
import { TowerType } from "../../game/entities/tower/TowerEntity";
import "../../css/uis/TowerPaletteRenderer.css"

export function TowerPaletteRenderer(): JSX.Element {
    const handleDragStart = (e: React.DragEvent, towerType: TowerType) => {
        e.dataTransfer.setData("towerType", towerType.toString());
    };
    
    return (
        <div className="tower-palette">
            {Object.values(TowerType).filter(v => typeof v === "number").map((type) => (
                <div
                    key={type}
                    className="tower-icon"
                    draggable
                    onDragStart={(e) => handleDragStart(e, type as TowerType)}
                    >
                        {TowerType[type as TowerType]}
                    </div>
            ))}
        </div>
    );
}