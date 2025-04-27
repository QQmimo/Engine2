import { Movable } from "System/Components";
import { GameObject } from "..";

export interface IArea {
    maxX: number;
    maxY: number;
    minX: number;
    minY: number;
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

    private _Grid: GameObject[][][] = [];
    private _GridCellSize: number = 100;
    private _GridWidth: number = 0;
    private _GridHeight: number = 0;
    public setGrid(width: number, height: number, screenWidth: number, screenHeight: number, screenLeft: number = 0, screenTop: number = 0): void {
        this._GridWidth = Math.ceil((screenWidth + screenLeft) / width);
        this._GridHeight = Math.ceil((screenHeight + screenTop) / height);
        this._GridCellSize = width;

        this._Grid = new Array(this._GridHeight);
        for (let y = 0; y < this._GridHeight; y++) {
            this._Grid[y] = new Array(this._GridWidth);
            for (let x = 0; x < this._GridWidth; x++) {
                this._Grid[y][x] = [];
            }
        }
    }

    private _checkCollisionsInCell(cell: GameObject[]): void {
        const len = cell.length;
        for (let i = 0; i < len; i++) {
            const movable1 = cell[i].getComponent(Movable);
            for (let j = i + 1; j < len; j++) {
                movable1.checkCollision(cell[j]);
            }
        }
    }

    private _checkCollisionsBetweenCells(cell1: GameObject[], cell2: GameObject[]): void {
        for (const obj1 of cell1) {
            const movable1 = obj1.getComponent(Movable);
            for (const obj2 of cell2) {
                movable1.checkCollision(obj2);
            }
        }
    }

    private _updatePhysic(): void {
        const movableObjects = GameObject.selectByComponent(Movable)
            .filter(o => o.getComponent(Movable).IsCollidable);

        // Очистка сетки
        for (let y = 0; y < this._GridHeight; y++) {
            for (let x = 0; x < this._GridWidth; x++) {
                if (this._Grid[y] && this._Grid[y][x]) {
                    this._Grid[y][x].length = 0;
                }
            }
        }

        // Заполнение сетки
        const cellSize = this._GridCellSize;
        const gridWidth = this._GridWidth;
        const gridHeight = this._GridHeight;

        for (const obj of movableObjects) {
            const x = Math.floor(obj.Transform.Position.X / cellSize);
            const y = Math.floor(obj.Transform.Position.Y / cellSize);

            if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
                if (!this._Grid[y]) this._Grid[y] = [];
                if (!this._Grid[y][x]) this._Grid[y][x] = [];

                this._Grid[y][x].push(obj);
            }
        }

        // Проверка коллизий
        for (let y = 0; y < gridHeight; y++) {
            if (!this._Grid[y]) continue;

            for (let x = 0; x < gridWidth; x++) {
                const cell = this._Grid[y][x];
                if (!cell || cell.length === 0) continue;

                // 1. Проверка внутри ячейки
                this._checkCollisionsInCell(cell);

                // 2. Проверка соседних ячеек (8-связность)
                const neighbors = [
                    [x + 1, y],     // справа
                    [x, y + 1],     // снизу
                    [x + 1, y + 1], // справа-снизу (диагональ)
                    [x - 1, y + 1]  // слева-снизу (диагональ)
                ];

                for (const [nx, ny] of neighbors) {
                    if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
                        const neighborCell = this._Grid[ny]?.[nx];
                        if (neighborCell?.length) {
                            this._checkCollisionsBetweenCells(cell, neighborCell);
                        }
                    }
                }
            }
        }
    }

    public update(_deltaTime: number): void {
        this._updatePhysic();
    }
}