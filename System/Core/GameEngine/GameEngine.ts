import { Movable } from "System/Components";
import { GameObject } from "..";

export interface IArea {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

export class GameEngine {
    private _Gravity: number = 0;
    public get Gravity(): number {
        return this._Gravity * this.MetrByPixels;
    }
    public set Gravity(value: number) {
        this._Gravity = value / this.MetrByPixels;
    }
    private _MetrByPixels: number = 1;
    public get MetrByPixels(): number {
        return this._MetrByPixels
    };
    public set MetrByPixels(value: number) {
        const valueGravity: number = this._Gravity * this._MetrByPixels;
        this._MetrByPixels = value;
        this.Gravity = valueGravity;
    }

    private _Areas: IArea[] = [];
    public get Areas(): IArea[] {
        return this._Areas;
    }
    public setGrid(width: number, height: number, screenWidth: number, screenHeight: number): void {
        const countRows: number = Math.ceil(screenHeight / height) + 1;
        const countColumns: number = Math.ceil(screenWidth / width) + 1;
        for (let rowIndex: number = 0; rowIndex < countRows; rowIndex++) {
            for (let columnIndex: number = 0; columnIndex < countColumns; columnIndex++) {
                this._Areas.push({
                    minX: (columnIndex - 1) * width,
                    minY: (rowIndex - 1) * height,
                    maxX: (columnIndex + 1) * width,
                    maxY: (rowIndex + 1) * height
                });
            }
        }
    }

    private _updatePhysic(_deltaTime: number): void {
        const movableObjects: GameObject[] = GameObject.selectByComponent(Movable)
            .filter(o => o.getComponent(Movable).IsCollidable);

        this._Areas.forEach(collisionArea => {
            const objectsInArea: GameObject[] = movableObjects
                .filter(obj => obj.Transform.Position.X >= collisionArea.minX
                    && obj.Transform.Position.Y >= collisionArea.minY
                    && obj.Transform.Position.X <= collisionArea.maxX
                    && obj.Transform.Position.Y <= collisionArea.maxY
                )

            for (let i: number = 0; i < objectsInArea.length; i++) {
                for (let j: number = objectsInArea.length - 1; j >= 0 && objectsInArea[i].Id !== objectsInArea[j].Id; j--) {
                    objectsInArea[i].getComponent(Movable).checkCollision(objectsInArea[j]);
                }
            }
        });
    }

    public update(deltaTime: number): void {
        this._updatePhysic(deltaTime);
    }
}