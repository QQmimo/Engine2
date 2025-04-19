import { BaseComponent, GameObject } from "System/Core";
import { Movable } from "..";
import { Vector2D } from "System/Utilities";

export class Physic extends BaseComponent {
    public Mass: number = 0;
    public Flex: number = 0.4;

    private _onCollision?: (object: GameObject, component: Physic) => void;
    public onCollision(action: (object: GameObject, component: Physic) => void) {
        this._onCollision = action;
    }

    public checkCollision(object: GameObject): boolean {
        const sub: Vector2D = this.Object.Transform.Position.subtract(object.Transform.Position);
        const distance = sub.Length;
        if (distance < this.Object.Transform.Size.Width + object.Transform.Size.Width) {
            this._onCollision?.apply(this, [object, this]);
            object.getComponent(Physic)._onCollision?.apply(this, [this.Object, object.getComponent(Physic)]);
            this._bounce(object);
            return true;
        }
        return false;
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
        const j = -(1 + this.Flex + object.getComponent(Physic).Flex) * velocityAlongNormal;
        const invMassSum = (this.Mass !== Infinity ? 1 / this.Mass : 0) + (object.tryGetComponent(Physic)!.Mass !== Infinity ? 1 / object.tryGetComponent(Physic)!.Mass : 0);
        const impulse = j / invMassSum;

        if (this.Mass !== Infinity) {
            moved.Velocity.X += (impulse * normal.X) / this.Mass;
            moved.Velocity.Y += (impulse * normal.Y) / this.Mass;
        }

        if (object.tryGetComponent(Physic)!.Mass !== Infinity) {
            object.tryGetComponent(Movable)!.Velocity.X -= (impulse * normal.X) / object.tryGetComponent(Physic)!.Mass;
            object.tryGetComponent(Movable)!.Velocity.Y -= (impulse * normal.Y) / object.tryGetComponent(Physic)!.Mass;
        }
    }
}