import { BaseComponent, GameObject } from "System/Core";
import { Vector2D } from "System/Utilities";

export class Moved extends BaseComponent {
    private _Velocity: Vector2D = new Vector2D(0, 0);
    public get Velocity(): Vector2D {
        return this._Velocity;
    }
    public set Velocity(value: Vector2D) {
        this._Velocity = this._Velocity.add(value);
    }
    private _Speed: number = 0;
    public get Speed(): number {
        return this._Speed;
    }
    public set Speed(value: number) {
        this._Speed = value;
    }
    private _Target: Vector2D | null = null;
    public get Target(): Vector2D | null {
        return this._Target;
    }
    public set Target(value: Vector2D | null) {
        this._Target = value;
        if (this._Target !== null) {
            const distance: Vector2D = this._Target.subtract(this.Object.Transform.Position);
            this._Velocity = distance.multiply(this.Speed / distance.length);
        }
        this._onChangeTarget?.apply(this, [this.Object, this]);
    }
    private _IsMoving: boolean = false;
    public get IsMoving(): boolean {
        return this._IsMoving;
    }

    private _onFinish?: (object: GameObject, component: Moved) => void;
    public onFinish(action: (object: GameObject, component: Moved) => void): void {
        this._onFinish = action;
    }
    private _onChangeTarget?: (object: GameObject, component: Moved) => void;
    public onChangeTarget(action: (object: GameObject, component: Moved) => void): void {
        this._onChangeTarget = action;
    }
    private _onMoving?: (object: GameObject, component: Moved) => void;
    public onMoving(action: (object: GameObject, component: Moved) => void): void {
        this._onMoving = action;
    }

    public update(deltaTime: number): void {
        if (this.Target !== null) {
            const distance: Vector2D = this.Target?.subtract(this.Object.Transform.Position);
            if (distance.length < 1) {
                this._IsMoving = false;
                this._onFinish?.apply(this, [this.Object, this]);
                return;
            }
        }
        this.Object.Transform.Position = this.Object.Transform.Position.add(this._Velocity.multiply(deltaTime));
        this._IsMoving = true;
        this._onMoving?.apply(this, [this.Object, this]);
    }
}