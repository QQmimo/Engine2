import { GameObject } from "..";

export class BaseComponent {
    constructor(object: GameObject) {
        this.Object = object;
    }

    public readonly Object: GameObject;
    public update(_deltaTime: number): void {

    };
}