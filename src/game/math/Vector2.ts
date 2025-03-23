export class Vector2 {
    constructor(public x: number, public y: number) {}

    /**
     * (0.0, 0.0)
     * @returns 
     */
    public static zero(): Vector2 {
        return new Vector2(0.0, 0.0);
    }

    /**
     * 長さ
     * @returns 
     */
    public magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * 二点間の距離を計る
     * @param lhs 
     * @param rhs 
     */
    public distance(other: Vector2): number {
        const diff_x: number = this.x - other.x;
        const diff_y: number = this.y - other.y;
        return Math.sqrt(diff_x * diff_x + diff_y * diff_y);
    }

    /**
     * 正規化
     * @returns 
     */
    public normalize(): Vector2 {
        const mag = this.magnitude();
        return mag === 0 ? Vector2.zero() : this.div(mag);
    }

    public add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    public sub(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    public mul(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    public div(scalar: number): Vector2 {
        if (scalar === 0) throw new Error("ゼロ除算です");
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    public equals(other: Vector2): boolean {
        return this.x === other.x && this.y === other.y;
    }

    public toString(): string {
        return `${this.x},${this.y}`;
    }
}