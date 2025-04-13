import { BaseObject, GameObject, GameScene } from "..";

export class GameLayer extends BaseObject {
    constructor(scene: GameScene, name?: string) {
        super(name ?? `GameLayer_${GameLayer.showAll().length + 1}`);
        this.Objects = new Map<string, GameObject>();
        this.Scene = scene;
    }

    //#region FIELDS
    private readonly Objects: Map<string, GameObject>;
    public readonly Scene: GameScene;
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
    public createObject(name?: string): GameObject {
        const object: GameObject = new GameObject(this, name);
        if (this.findObjectById(object.Id) !== null) {
            throw new Error(`ОШИБКА: ${object.constructor.name} с идентификатором '${object.Id}' уже существует.`);
        }
        this.Objects.set(object.Id, object);
        this._onAddObject?.apply(this, [object]);
        return object;
    }
    public addObject(object: GameObject): GameObject {
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
    public static findById(id: string): GameLayer | null {
        return super.findById(id) as GameLayer;
    }
    public static findByName(name: string): GameLayer | null {
        return super.findByName(name) as GameLayer;
    }
    public static selectByTag(tag: string): GameLayer[] {
        return super.selectByTag(tag) as GameLayer[];
    }
    public static showAll(): GameLayer[] {
        return super.showAll() as GameLayer[];
    }
    //#endregion
}