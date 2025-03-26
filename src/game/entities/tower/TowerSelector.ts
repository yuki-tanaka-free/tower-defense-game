import { TowerEntity } from "./TowerEntity";

type Listener = () => void;

/**
 * タワー選択イベントを管理
 */
export class TowerSelector {
    private static _instance: TowerSelector;
    private _selectedTower: TowerEntity | null = null;
    private _listeners: Set<Listener> = new Set();

    static getInstance(): TowerSelector {
        if (!this._instance) {
            this._instance = new TowerSelector();
        }
        return this._instance;
    }

    /**
     * 選択中のタワー
     */
    get selectedTower(): TowerEntity | null {
        return this._selectedTower;
    }

    /**
     * タワーを選択
     */
    set selectedTower(tower: TowerEntity | null) {
        this._selectedTower = tower;
        this._listeners.forEach(cb => cb()); // 通知
    }

    /**
     * タワーが選択された時に呼ばれるイベントを追加
     * @param callback 
     */
    addListener(callback: Listener): void {
        this._listeners.add(callback);
    }

    /**
     * タワーが選択された時に呼ばれるイベントを削除
     * @param callback 
     */
    removeListener(callback: Listener): void {
        this._listeners.delete(callback);
    }
}