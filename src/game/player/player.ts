/**
 * プレイヤー
 */
export class Player {
    constructor(
        private _money: number
    ) {}

    /**
     * 所持金
     */
    public get money(): number {
        return this._money;
    }
}