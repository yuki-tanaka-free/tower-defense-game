import { memo, JSX } from "react";
import { WaveControlRenderer } from "../uis/WaveControlRenderer";
import { TowerPaletteRenderer } from "../uis/TowerPaletteRenderer";
import "../../css/core/UIRenderer.css"

function UIRenderer(): JSX.Element {
    return (
        <div className="ui-renderer">
            <WaveControlRenderer />
            <TowerPaletteRenderer />
        </div>
    )
};

export const MemoizedUIRenderer = memo(UIRenderer);