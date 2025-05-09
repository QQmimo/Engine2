import { Guid } from "System/Utilities";

export class BaseObject {
    constructor(name: string) {
        this.Id = Guid.new();
        this.Name = name;
        this.Tags = new Set<string>();
        BaseObject.add(this);
    }

    //#region FIELDS
    public readonly Name: string;
    public readonly Id: string;
    public readonly Tags: Set<string>;
    //#endregion

    //#region EVENTS
    protected _onDestroy?: () => void;
    public onDestroy(action: () => void): void {
        this._onDestroy = action;
    }
    protected _onUpdate?: (deltatime: number) => void;
    public onUpdate(action: (deltatime: number) => void): void {
        this._onUpdate = action;
    }
    //#endregion

    //#region METHODS
    public addTag(tag: string): void {
        this.Tags.add(tag);
    }
    public deleteTag(tag: string): void {
        this.Tags.delete(tag);
    }
    public destroy(): void {
        BaseObject.delete(this.Id);
        this._onDestroy?.apply(this);
    }
    //#endregion

    //#region GLOBAL
    protected static All: Map<string, BaseObject> = new Map();
    protected static get AllAsArray(): BaseObject[] {
        const result: BaseObject[] = [];
        this.All.forEach(object => object.constructor.name === this.name ? result.push(object) : null);
        return result;
    }

    protected static add(object: BaseObject): void {
        if (BaseObject.findById(object.Id)) {
            throw new Error(`ОШИБКА: ${this.name} c идентификатором '${object.Id}' уже существует.`);
        }
        this.All.set(object.Id, object);
    }

    public static findById(id: string): BaseObject | null {
        return this.AllAsArray.find(object => this.name === object.constructor.name && object.Id === id) ?? null;
    }
    public static findByName(name: string): BaseObject | null {
        return this.AllAsArray.find(object => this.name === object.constructor.name && object.Name === name) ?? null;
    }
    public static selectByTag(tag: string): BaseObject[] {
        return this.AllAsArray.filter(object => object.Tags.has(tag));
    }
    public static showAll(): BaseObject[] {
        return this.AllAsArray;
    }
    public static delete(id: string): void {
        this.All.delete(id);
    }
    //#endregion
}