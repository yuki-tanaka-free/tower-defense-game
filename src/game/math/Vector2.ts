export class Vector2 {
    constructor(public x: number, public y: number) {}

    /**
     * 二点間の距離を計る
     * @param lhs 
     * @param rhs 
     */
    distance(lhs: Vector2, rhs:Vector2): number {
        const diff_x: number = lhs.x - rhs.x;
        const diff_y: number = lhs.y - rhs.y;
        return Math.sqrt(diff_x * diff_x + diff_y * diff_y);
    }
}