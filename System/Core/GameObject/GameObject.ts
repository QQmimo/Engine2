import { Transformed } from "System/Components";
import { BaseComponent, BaseObject, GameLayer } from "..";

export class GameObject extends BaseObject {
    constructor(layer: GameLayer, name?: string) {
        super(name ?? `GameObject_${GameObject.showAll().length + 1}`);
        this.Components = new Map<string, BaseComponent>();
        this.Layer = layer;
        [Transformed].forEach(component => this.addComponent(component));
    }

    //#region FIELDS
    private _Layer?: GameLayer;
    public get Layer(): GameLayer {
        return this._Layer!;
    }
    public set Layer(value: GameLayer) {
        value.addObject(this);
        this._Layer = value;
    };
    private Components: Map<string, BaseComponent>;
    public get Transform(): Transformed {
        return this.getComponent(Transformed);
    }
    //#endregion

    //#region METHODS
    public addComponent<T extends BaseComponent>(componentType: { new(object: GameObject): T }): T {
        const component: T = new componentType(this);
        this.Components.set(componentType.name, component);
        return component;
    }
    public getComponent<T extends BaseComponent>(componentType: { new(object: GameObject): T }): T {
        const found: T = this.Components.get(componentType.name) as T;
        if (found === undefined) {
            throw new Error(`ОШИБКА: Компонент '${componentType.name}' не найден.`);
        }
        return found;
    }
    public tryGetComponent<T extends BaseComponent>(componentType: { new(object: GameObject): T }): T | null {
        return this.Components.get(componentType.name) as T;
    }
    public destroyComponent<T extends BaseComponent>(componentType: { new(object: GameObject): T }): void {
        this.Components.delete(componentType.name);
    }
    public update(deltaTime: number): void {
        this.Components.forEach(component => {
            component.update(deltaTime);
        });
    }
    //#endregion

    //#region GLOBAL
    public static findById(id: string): GameObject | null {
        return super.findById(id) as GameObject;
    }
    public static findByName(name: string): GameObject | null {
        return super.findByName(name) as GameObject;
    }
    public static selectByTag(tag: string): GameObject[] {
        return super.selectByTag(tag) as GameObject[];
    }
    public static showAll(): GameObject[] {
        return super.showAll() as GameObject[];
    }
    public static selectByComponent(component: { new(gameObject: GameObject): BaseComponent }): GameObject[] {
        return super.showAll().filter(object => object instanceof GameObject && object.tryGetComponent(component)) as GameObject[];
    }
    //#endregion
}