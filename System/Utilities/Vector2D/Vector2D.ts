export class Vector2D {
    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }

    public X: number;
    public Y: number;

    public add(vector: Vector2D): Vector2D {
        return new Vector2D(this.X + vector.X, this.Y + vector.Y);
    }

    public subtract(vector: Vector2D): Vector2D {
        return new Vector2D(this.X - vector.X, this.Y - vector.Y);
    }

    public normalize(): Vector2D {
        const length = this.length;
        return new Vector2D(this.X / length, this.Y / length);
    }

    public dot(vector: Vector2D): number {
        return this.X * vector.X + this.Y * vector.Y;
    }

    public multiply(scalar: number): Vector2D {
        return new Vector2D(this.X * scalar, this.Y * scalar);
    }

    public distance(vector: Vector2D): number {
        return this.subtract(vector).length;
    }

    public get length(): number {
        return Math.sqrt(this.X * this.X + this.Y * this.Y);
    }

}