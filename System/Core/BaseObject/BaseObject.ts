import { Guid } from "System/Types";

export class BaseObject {
    constructor(name?: string) {
        this.Id = Guid.new();
        this.Name = name ?? `${this.constructor.name}_${BaseObject.All.values.length + 1}`;
        this.Tags = [];
        BaseObject.add(this);
    }

    //#region FIELDS
    public readonly Name: string;
    public readonly Id: string;
    public readonly Tags: string[];
    //#endregion

    //#region EVENTS
    private _onDestroy?: () => void;
    public onDestroy(action: () => void): void {
        this._onDestroy = action;
    }
    //#endregion

    //#region METHODS
    public addTag(tag: string): void {
        this.Tags.push(tag);
    }
    public destroy(): void {
        BaseObject.delete(this.Id);
        this._onDestroy?.apply(this);
    }
    public update(deltaTime: number): void {

    };
    //#endregion

    //#region GLOBAL
    protected static All: Map<string, BaseObject> = new Map();
    protected static get AllAsArray(): BaseObject[] {
        return Array.from(this.All, ([key, value]) => value);
    }

    protected static add(object: BaseObject): void {
        if (BaseObject.findById(object.Id)) {
            throw new Error(`ОШИБКА: ${this.name} c идентификатором '${object.Id}' уже существует.`);
        }
        this.All.set(object.Id, object);
    }

    public static findById(id: string): BaseObject | null {
        return (this.AllAsArray as BaseObject[]).find(object => this.name === object.constructor.name && object.Id === id) ?? null;
    }
    public static findByName(name: string): BaseObject | null {
        return (this.AllAsArray as BaseObject[]).find(object => this.name === object.constructor.name && object.Name === name) ?? null;
    }
    public static findByTag(tag: string): BaseObject[] {
        return (this.AllAsArray as BaseObject[]).filter(object => object.Tags.includes(tag));
    }
    public static showAll(): BaseObject[] {
        return this.AllAsArray;
    }
    public static delete(id: string): void {
        this.All.delete(id);
    }
    //#endregion
}