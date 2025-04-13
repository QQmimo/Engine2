import { GameObject } from "System/Core";
import { Vector2D } from "../Vector2D/Vector2D";

export class Angle extends Number {
    public toDegree(): number {
        return this.valueOf() * 180 / Math.PI;
    }
    public toRadian(): number {
        return this.valueOf();
    }

    public static degree(value: number): Angle {
        return new Angle(value * Math.PI / 180);
    }
    public static byPoints(objectA: GameObject, objectB: GameObject): Angle
    public static byPoints(object: GameObject, point: Vector2D): Angle
    public static byPoints(point: Vector2D, object: GameObject): Angle
    public static byPoints(pointA: Vector2D, pointB: Vector2D): Angle
    public static byPoints(pointOrObjectA: Vector2D | GameObject, pointOrObjectB: Vector2D | GameObject): Angle {
        const pointA: Vector2D = pointOrObjectA instanceof GameObject ? pointOrObjectA.Transform.Position : pointOrObjectA;
        const pointB: Vector2D = pointOrObjectB instanceof GameObject ? pointOrObjectB.Transform.Position : pointOrObjectB;
        return new Angle(Math.atan2(pointB.Y - pointA.Y, pointB.X - pointA.X));
    }
}