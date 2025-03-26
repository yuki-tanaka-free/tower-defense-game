import { EntityState } from "../EntityState";
import { TowerType } from "./TowerType";

export interface TowerState extends EntityState {
    level: number;
    towerType: TowerType;
    buyAmount: number;
    updateAmount: number;
    saleAmount: number;
}