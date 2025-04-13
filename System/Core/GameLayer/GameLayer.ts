import { BaseObject, GameObject } from "..";

export class GameLayer extends BaseObject {
    constructor(name?: string) {
        super(name);
        this.Objects = new Map<string, GameObject>();
    }

    //#region FIELDS
    private readonly Objects: Map<string, GameObject>;
    private get ObjectsAsArray(): GameObject[] {
        return Array.from(this.Objects, ([key, value]) => value);
    }
    //#endregion

    //#region EVENTS
    private _onAddObject?: (object: GameObject) => void;
    public onAddObject(action: (object: GameObject) => void): void {
        this._onAddObject = action;
    }
    //#endregion

    //#region METHODS
    public update(deltaTime: number): void {
        this.Objects.forEach(object => object.update(deltaTime));
    }
    public addObject(name?: string): GameObject {
        const object: GameObject = new GameObject(name);
        if (this.findObjectById(object.Id) !== null) {
            throw new Error(`ОШИБКА: ${object.constructor.name} с идентификатором '${object.Id}' уже существует.`);
        }
        this.Objects.set(object.Id, object);
        this._onAddObject?.apply(this, [object]);
        return object;
    }
    public destroyObject(id: string): void {
        this.findObjectById(id)?.destroy();
    }
    public findObjectById(id: string): GameObject | null {
        return this.Objects.get(id) ?? null;
    }
    public destroy(): void {
        this.Objects.forEach(object => object.destroy());
        super.destroy();
    }
    //#endregion

    //#region GLOBAL
    public static findById(id: string): GameObject | null {
        return super.findById(id) as GameObject;
    }
    public static findByName(name: string): GameObject | null {
        return super.findByName(name) as GameObject;
    }
    public static findByTag(tag: string): GameObject[] {
        return super.findByTag(tag) as GameObject[];
    }
    public static showAll(): GameObject[] {
        return super.showAll() as GameObject[];
    }
    //#endregion
}