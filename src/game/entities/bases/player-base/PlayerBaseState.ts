import { EntityState } from "../../EntityState";

/**
 * プレイヤーの基地を描画するのに使用する情報
 */
export interface PlayerBaseState extends EntityState {
    hp: number;
}