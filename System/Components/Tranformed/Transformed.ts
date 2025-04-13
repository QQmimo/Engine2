import { BaseComponent } from "System/Core";
import { Angle, Size, Vector2D } from "System/Utilities";

export class Transformed extends BaseComponent {
    public Position: Vector2D = new Vector2D(0, 0);
    public Rotation: Angle = new Angle(0);
    public Size: Size = new Size(50, 50);
    public Fill?: string;
}