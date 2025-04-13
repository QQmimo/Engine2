import { Scale } from "../Scale/Scale";

export class Size {
    constructor(width: number, height: number, scale: Scale = new Scale(1, 1)) {
        this._Scale = scale;
        this._Width = width * scale.Width;
        this._Height = height * scale.Height;
    }

    private _Scale: Scale;
    public get Scale(): Scale {
        return this._Scale;
    }
    public set Scale(value: Scale) {
        this._Scale = value;
    }

    private _Width: number;
    public get Width() {
        return this._Width;
    }
    public set Width(value: number) {
        this._Width = value * this.Scale.Width;
    }

    private _Height: number;
    public get Height(): number {
        return this._Height;
    }
    public set Height(value: number) {
        this._Height = value * this.Scale.Height;
    }
}