import React from "react";
import { WaveControlRenderer } from "../uis/WaveControlRenderer";
import "../../css/uis/UIRenderer.css"

export const UIRenderer: React.FC = React.memo(() => {
    return (
        <div className="ui-renderer">
            <WaveControlRenderer />
        </div>
    )
});