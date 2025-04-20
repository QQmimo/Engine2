import { BaseComponent, GameScreen } from "System/Core";

export class Drawable extends BaseComponent {
    private get _Screen(): GameScreen {
        return this.Object.Layer.Scene.Screen;
    }

    public update(_deltaTime: number): void {
        this._Screen.Context!.beginPath();
        this._Screen.Context!.arc(
            this.Object.Transform.Position.X,
            this.Object.Transform.Position.Y,
            this.Object.Transform.Size.Width,
            0,
            360);
        const gradient = this._Screen.Context!.createRadialGradient(
            this.Object.Transform.Position.X,
            this.Object.Transform.Position.Y,
            0,
            this.Object.Transform.Position.X,
            this.Object.Transform.Position.Y,
            this.Object.Transform.Size.Width
        );
        gradient.addColorStop(0, this.Object.Transform.Fill ?? 'red');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this._Screen.Context!.fillStyle = gradient;
        this._Screen.Context!.fill();
        this._Screen.Context!.closePath();
    }
}