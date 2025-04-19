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

    private _updatePhysic(_deltaTime: number): void {
        // const objects: GameObject[] = GameObject.selectByComponent(Physic);
        // for (let i: number = 0; i < objects.length; i++) {
        //     objects[i].getComponent(Movable).Velocity = new Vector2D(0, this._Gravity);
        //     for (let j: number = objects.length - 1; j >= 0 && objects[i].Id !== objects[j].Id; j--) {
        //         objects[i].getComponent(Physic).checkCollision(objects[j]);
        //     }
        // }
    }

    public update(deltaTime: number): void {
        this._updatePhysic(deltaTime);
    }
}