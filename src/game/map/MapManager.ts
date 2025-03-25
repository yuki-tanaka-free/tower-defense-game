import { Vector2 } from "../math/Vector2";
import { CsvLoader } from "../utils/CsvLoader";
import { MapChip } from "./MapChip";
import { MapChipType } from "./MapChipType";


/**
 * CSVの文字をマップチップの種類に変換
 */
const mapCharToType: Record<string, MapChipType> = {
    "N": MapChipType.None,
    "P": MapChipType.PlayerBase,
    "E": MapChipType.EnemyBase,
    "M": MapChipType.Mountain,
    "S": MapChipType.Sea,
    "T": MapChipType.Tower,
    "R": MapChipType.EnemyRoute
}

/**
 * マップマネージャー
 * シングルトンクラス
 */
export class MapManager {
    /**
     * マップ
     */
    private _map: MapChip[][];
    /**
     * エネミーの経路（EからPまでの経路）
     */
    private _enemyPath: Vector2[] = [];

    constructor() {
        // 15 * 15 でマップを初期化（`null` ではなく `MapChip` オブジェクトを入れる）
        this._map = Array.from({ length: 15 }, (_, y) =>
            Array.from({ length: 15 }, (_, x) => new MapChip(new Vector2(x, y), MapChipType.None))
        );
    }

    /**
     * マップのロード
     */
    public async loadMap() {
        // CSVを行ごとに分解 \r（CR）を除去し、LF（\n）で統一
        const rows = await CsvLoader.loadCsv("/assets/map.csv");

        // 各行ごとにCSVを読み込み
        this._map = rows.map((row, y) =>
            row.split(",").map((cell, x) => {
                // マップチップの生成
                const mapChipType = mapCharToType[cell] || MapChipType.None;
                return new MapChip(new Vector2(x, y), mapChipType)
            }));

        // 経路の計算
        this._enemyPath = this.findEnemyPath();
    }

    /**
     * マップチップ
     */
    public get map(): MapChip[][] {
        return this._map;
    }

    /**
     * エネミーの経路
     */
    public get enemyPath(): Vector2[] {
        return this._enemyPath;
    }

    /**
     * 指定した座標のマップチップを取得
     * @param position 取得したい座標
     */
    public getMapChip(position: Vector2): MapChip | null {
        if (
            position.y < 0 || position.y >= this._map.length ||
            position.x < 0 || position.x >= this._map[0].length
        ) {
            console.warn(`getMapChip: 無効な座標です (${position.x}, ${position.y})`);
            return null;
        }
        return this._map[position.y][position.x];
    }

    /**
     * エネミーのスタート地点（E）からゴール（P）までの経路を探索
     * @returns 
     */
    private findEnemyPath(): Vector2[] {
        const dirs = [
            new Vector2(1, 0), new Vector2(-1, 0),
            new Vector2(0, 1), new Vector2(0, -1)
        ];

        // visited: [y][x] の順で、すべて false で初期化
        const visited: boolean[][] = Array.from({ length: this._map.length }, () =>
            Array(this._map[0].length).fill(false)
        );

        const queue: { pos: Vector2, path: Vector2[] }[] = [];

        let start: Vector2 | null = null;
        let goal: Vector2 | null = null;

        // スタート（E）とゴール（P）を探す
        for (let y = 0; y < this._map.length; y++) {
            for (let x = 0; x < this._map[y].length; x++) {
                const chip = this._map[y][x];
                if (chip.mapChipType === MapChipType.EnemyBase) {
                    start = new Vector2(x, y);
                }
                if (chip.mapChipType === MapChipType.PlayerBase) {
                    goal = new Vector2(x, y);
                }
            }
        }

        if (!start || !goal) {
            console.warn("スタートまたはゴールが見つかりません");
            return [];
        }

        // 幅優先探索 開始(BFS)
        queue.push({ pos: start, path: [start] });
        visited[start.y][start.x] = true;

        while (queue.length > 0) {
            const { pos, path } = queue.shift()!;

            if (pos.equals(goal)) {
                // ゴール（プレイヤー基地）には乗らず、一歩手前で止める
                return path.slice(0, -1);
            }

            for (const dir of dirs) {
                const next = pos.add(dir);

                // 範囲外チェック
                if (
                    next.x < 0 || next.x >= this._map[0].length ||
                    next.y < 0 || next.y >= this._map.length
                ) {
                    continue;
                }

                const chip = this._map[next.y][next.x];

                // 通行可能かつ未訪問ならキューに追加
                if (
                    (chip.mapChipType === MapChipType.EnemyRoute || chip.mapChipType === MapChipType.PlayerBase) &&
                    !visited[next.y][next.x]
                ) {
                    visited[next.y][next.x] = true;
                    queue.push({ pos: next, path: [...path, next] });
                }
            }
        }

        return [];
    }
}