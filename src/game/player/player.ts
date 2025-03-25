import { PlayerState } from "./PlayerState";

/**
 * プレイヤー
 */
export class Player {
    private changedListeners = new Set<(state: PlayerState) => void>();
    
    constructor(
        private _money: number = 500 // 初期の所持金
    ) {}

    /**
     * 所持金
     */
    public get money(): number {
        return this._money;
    }

    /**
     * 購入を行う
     * @param price 買いたいものの金額
     * @returns 購入できたか？
     */
    public buying(price: number): boolean {
        const newMoney = this._money - price;
        if (newMoney < 0) return false; // お金が足りない
        this._money = newMoney;
        this.notifyChanged();
        return true;
    }

    /**
     * プレイヤーの情報が変わった時に呼ばれるイベントを追加
     * @param listener 
     */
    public addOnChangedListener(listener: (state: PlayerState) => void): void {
        this.changedListeners.add(listener);
    }

    /**
     * プレイヤーの情報が変わった時に呼ばれるイベントを削除
     * @param listener 
     */
    public removeOnChangedListener(listener: (state: PlayerState) => void): void {
        this.changedListeners.delete(listener);
    }

    /**
     * プレイヤーの情報が変わった時に呼ばれるイベントに通知
     */
    private notifyChanged(): void {
        this.changedListeners.forEach(listener => listener(this.getState()));
    }

    /**
     * プレイヤーの現在の状態
     * @returns 
     */
    public getState(): PlayerState {
        return {
            money: this._money
        }
    }
}