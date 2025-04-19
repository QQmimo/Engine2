import { BaseComponent } from "System/Core";

export class Dictionary extends BaseComponent {
    private _Dictionary: Map<string, unknown> = new Map<string, unknown>();

    public set<T>(key: string, value: T): void {
        this._Dictionary.set(key, value);
    }

    public get<T>(key: string): T {
        return this._Dictionary.get(key) as T;
    }
}