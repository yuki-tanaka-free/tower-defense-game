import { memo, JSX, useState, useEffect } from "react";
import { GameManager } from "../../game/core/GameManager";
import { TowerEntity, TowerType } from "../../game/entities/tower/TowerEntity";
import { TowerParameterTable } from "../../game/entities/tower/TowerParameterTable";
import { GameSettings } from "../settings/GameSettings";
import { Vector2 } from "../../game/math/Vector2";
import { MapChipType } from "../../game/map/MapChipType";
import { MapChip } from "../../game/map/MapChip";
import "../../css/map/MapInteractionLayer.css"

function MapInteractionLayer(): JSX.Element | null {
    const gameManager = GameManager.getInstance();

    // ゲームのライフタイムが変わった時に更新すればいいだけなので、ダミーのステートを使用
    const [_, forceUpdate] = useState(0);
    useEffect(() => {
        const onGameChanged = () => {
            forceUpdate((prev) => prev + 1);
        }

        gameManager.addGameStateChanged(onGameChanged);
        return () => gameManager.removeGameStateChanged(onGameChanged);
    }, [gameManager]);

    const mapManager = gameManager.mapManager;
    const entityManager = gameManager.entitiesManager;

    if (!mapManager || !entityManager) return null;
    const mapData = mapManager.map;

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, position: Vector2): void => {
        e.preventDefault();
        const towerTypeStr = e.dataTransfer?.getData("towerType");
        if (!towerTypeStr) return;

        const towerType = Number(towerTypeStr) as TowerType;
        const level = 1;

        const chip = mapManager.getMapChip(position);
        if (chip?.mapChipType !== MapChipType.Tower) {
            console.log("設置できないマスです");
            return;
        }

        const tower = new TowerEntity(
            position,
            towerType,
            level,
            TowerParameterTable.getAttack(towerType, level),
            TowerParameterTable.getAttackRange(towerType, level),
            TowerParameterTable.getAttackCooltime(towerType, level),
            TowerParameterTable.getBuyAmount(towerType, level),
            TowerParameterTable.getUpgradeAmount(towerType, level),
            TowerParameterTable.getSellAmount(towerType, level)
        );

        entityManager.addEntity(tower);
    };

    /**
     * タワーを立てれる場所かチェック
     * @param chip 
     * @returns 
     */
    const isAllowedDropPosition = (chip: MapChip | null): boolean => {
        return chip?.mapChipType === MapChipType.Tower;
    }

    /**
     * data-x, data-yをVector2に変換して取得
     * @param elem 
     * @returns 
     */
    const getPositionFromElement = (elem: HTMLElement): Vector2 => {
        const x = Number(elem.getAttribute("data-x"));
        const y = Number(elem.getAttribute("data-y"));
        return new Vector2(x, y);
    }

    return (
        <div
            className="map-interaction-layer"
            style={{
                gridTemplateColumns: `repeat(${mapData[0].length}, ${GameSettings.TILE_SIZE}px)`,
            }}>
            {mapData.flatMap((row, y) =>
                row.map((_, x) => (
                    <div
                        key={`${x}-${y}`}
                        className="map-interaction-cell"
                        data-x={x}
                        data-y={y}
                        style={{
                            cursor: gameManager.isGamePaused() ? "not-allowed" : "default",
                        }}
                        onDragEnter={(e) => {
                            const chip = mapManager.getMapChip(getPositionFromElement(e.currentTarget));
                            const allowed = isAllowedDropPosition(chip);

                            e.dataTransfer.dropEffect = allowed ? "copy" : "none";

                            if (allowed === false) {
                                e.currentTarget.classList.add("not-allowed");
                            }
                        }}
                        onDragLeave={(e) => {
                            e.currentTarget.classList.remove("not-allowed");
                        }}
                        onDragOver={(e) => {
                            const chip = mapManager.getMapChip(getPositionFromElement(e.currentTarget));
                            const allowed = isAllowedDropPosition(chip);

                            e.preventDefault();
                            e.dataTransfer.dropEffect = allowed ? "copy" : "none";
                        }}
                        onDrop={(e) => 
                            {
                                if (gameManager.isGamePaused()) return;

                                e.preventDefault();
                                e.currentTarget.classList.remove("not-allowed");

                                const targetPos = getPositionFromElement(e.currentTarget);
                                handleDrop(e, targetPos);
                            }
                        }/>
                ))
            )}
        </div>
    );
};

export const MemoizedMapInteractionLayer = memo(MapInteractionLayer);