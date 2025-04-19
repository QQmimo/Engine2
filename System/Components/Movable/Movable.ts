import { BaseComponent, GameObject } from "System/Core";
import { Vector2D } from "System/Utilities";

export class Movable extends BaseComponent {
    public IsCollidable: boolean  = false;

    private _Forces: Set<Vector2D> = new Set<Vector2D>();
    public get Forces(): Set<Vector2D> {
        return this._Forces;
    }

    public get Velocity(): Vector2D {
        let velocity: Vector2D = new Vector2D(0, 0);
        this.Forces.forEach(force => {
            velocity = velocity.add(force);
        });
        return velocity;
    }

    public get IsMoving(): boolean {
        return !this.Velocity.IsZero;
    }

    private _onMoving?: (object: GameObject, component: Movable) => void;
    public onMoving(action: (object: GameObject, component: Movable) => void): void {
        this._onMoving = action;
    }
    private _onStoped?: (object: GameObject, component: Movable) => void;
    public onStoped(action: (object: GameObject, component: Movable) => void): void {
        this._onStoped = action;
    }

    public addForce(force: Vector2D): void {
        this._Forces.add(force);
    }

    public update(deltaTime: number): void {
        this.Object.Transform.Position = this.Object.Transform.Position.add(this.Velocity.multiply(deltaTime));

        if (this.IsMoving) {
            this._onMoving?.apply(this, [this.Object, this]);
        }
        else {
            this._onStoped?.apply(this, [this.Object, this]);
        }
    }
}