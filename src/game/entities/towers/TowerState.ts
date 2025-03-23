import { EntityState } from "../EntityState";
import { TowerType } from "./TowerEntity";

export interface TowerState extends EntityState {
    towerType: TowerType;
    buyAmount: number;
    updateAmount: number;
    saleAmount: number;
}