import { BaseComponent, GameObject } from "System/Core";
import { Moved } from "..";
import { Vector2D } from "System/Utilities";

export class Physic extends BaseComponent {
    public Mass: number = 0;

    private _getNeighbours(count: number = 10): GameObject[] {
        const neighbours: GameObject[] = GameObject
            .selectByComponent(Physic)
            .filter(object => object.Id !== this.Object.Id)
            .map(object => ({
                distance: this.Object.Transform.Position.distance(object.Transform.Position),
                object: object
            }))
            .sort((a, b) => {
                if (a.distance > b.distance) {
                    return 1;
                }
                else if (a.distance < b.distance) {
                    return -1;
                }
                return 0;
            })
            .filter((_object, index) => index < count)
            .map(object => object.object);

        return neighbours;
    }

    private _onCollision?: (object: GameObject, component: Physic) => void;
    public onCollision(action: (object: GameObject, component: Physic) => void) {
        this._onCollision = action;
    }

    private _checkCollision(object: GameObject): boolean {
        const sub: Vector2D = this.Object.Transform.Position.subtract(object.Transform.Position);
        const distance = sub.length;
        return distance < this.Object.Transform.Size.Width + object.Transform.Size.Width;
    }

    public update(_deltaTime: number): void {
        let moved: Moved | null = this.Object.tryGetComponent(Moved);
        if (moved === null) {
            moved = this.Object.addComponent(Moved);
        }
        if (moved.IsMoving) {
            const neighbours: GameObject[] = this._getNeighbours();
            neighbours.forEach(neighbour => {
                if (this._checkCollision(neighbour)) {
                    const relativeVelocity = moved.Velocity.subtract(neighbour.tryGetComponent(Moved)?.Velocity ?? new Vector2D(0, 0));
                    const dx = this.Object.Transform.Position.X - neighbour.Transform.Position.X;
                    const dy = this.Object.Transform.Position.Y - neighbour.Transform.Position.Y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const normal: Vector2D = new Vector2D(dx / distance, dy / distance).normalize();
                    const velocityAlongNormal: number = relativeVelocity.dot(normal);

                    if (velocityAlongNormal > 0) {
                        return;
                    }
                    const j = -(1.8) * velocityAlongNormal;
                    const invMassSum = (this.Mass !== Infinity ? 1 / this.Mass : 0) + (neighbour.tryGetComponent(Physic)!.Mass !== Infinity ? 1 / neighbour.tryGetComponent(Physic)!.Mass : 0);
                    const impulse = j / invMassSum;

                    if (this.Mass !== Infinity) {
                        moved.Velocity.X += (impulse * normal.X) / this.Mass;
                        moved.Velocity.Y += (impulse * normal.Y) / this.Mass;
                    }

                    if (neighbour.tryGetComponent(Physic)!.Mass !== Infinity) {
                        neighbour.tryGetComponent(Moved)!.Velocity.X -= (impulse * normal.X) / neighbour.tryGetComponent(Physic)!.Mass;
                        neighbour.tryGetComponent(Moved)!.Velocity.Y -= (impulse * normal.Y) / neighbour.tryGetComponent(Physic)!.Mass;
                    }

                    this._onCollision?.apply(this, [neighbour, this]);
                    neighbour.getComponent(Physic)._onCollision?.apply(this, [this.Object, neighbour.getComponent(Physic)]);
                }
            });
        }
    }
}