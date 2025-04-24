import { BaseComponent, GameObject } from "System/Core";
import { Vector2D } from "System/Utilities";

export class Movable extends BaseComponent {
    public Mass: number = 0;
    public Flex: number = 0.4;
    public IsCollidable: boolean = false;

    public _Velocity: Vector2D = new Vector2D(0, 0);
    public get Velocity(): Vector2D {
        return this._Velocity;
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

    private _onCollision?: (object: GameObject, component: Movable) => void;
    public onCollision(action: (object: GameObject, component: Movable) => void): void {
        this._onCollision = action;
    }

    public addForce(force: Vector2D): void {
        this._Velocity = this._Velocity.add(force);
    }

    public stop(): void {
        this._Velocity = new Vector2D(0, 0);
    }

    private _bounce(object: GameObject): void {
        let moved: Movable | null = this.Object.tryGetComponent(Movable);
        if (moved === null) {
            moved = this.Object.addComponent(Movable);
        }
        const relativeVelocity = moved.Velocity.subtract(object.tryGetComponent(Movable)?.Velocity ?? new Vector2D(0, 0));
        const dx = this.Object.Transform.Position.X - object.Transform.Position.X;
        const dy = this.Object.Transform.Position.Y - object.Transform.Position.Y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const normal: Vector2D = new Vector2D(dx / distance, dy / distance).normalize();
        const velocityAlongNormal: number = relativeVelocity.dot(normal);

        if (velocityAlongNormal > 0) {
            return;
        }
        const j = -(1 + this.Flex + object.getComponent(Movable).Flex) * velocityAlongNormal;
        const invMassSum = (this.Mass !== Infinity ? 1 / this.Mass : 0) + (object.tryGetComponent(Movable)!.Mass !== Infinity ? 1 / object.tryGetComponent(Movable)!.Mass : 0);
        const impulse = j / invMassSum;

        if (this.Mass !== Infinity) {
            moved.addForce(new Vector2D(
                (impulse * normal.X) / this.Mass,
                (impulse * normal.Y) / this.Mass
            ));
        }

        if (object.tryGetComponent(Movable)!.Mass !== Infinity) {
            object.tryGetComponent(Movable)!.addForce(new Vector2D(
                -(impulse * normal.X) / object.tryGetComponent(Movable)!.Mass,
                -(impulse * normal.Y) / object.tryGetComponent(Movable)!.Mass
            ));
        }
    }

    public checkCollision(object: GameObject): boolean {
        if (this.IsCollidable) {
            const sub: Vector2D = this.Object.Transform.Position.subtract(object.Transform.Position);
            const distance = sub.Length;
            if (distance < this.Object.Transform.Size.Width + object.Transform.Size.Width) {
                this._onCollision?.apply(this, [object, this]);
                object.getComponent(Movable)._onCollision?.apply(this, [this.Object, object.getComponent(Movable)]);
                this._bounce(object);
                return true;
            }
        }
        return false;
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