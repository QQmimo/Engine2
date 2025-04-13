import { BaseObject, GameLayer, GameScreen } from "..";

export class GameScene extends BaseObject {
    constructor(screen: GameScreen, name?: string) {
        super(name ?? `GameScene_${GameScene.showAll().length + 1}`);
        this.Layers = new Map<string, GameLayer>();
        this.Screen = screen;
    }

    //#region FIELDS
    private readonly Layers: Map<string, GameLayer>;
    public readonly Screen: GameScreen;
    //#endregion

    //#region EVENTS
    private _onAddLayer?: (layer: GameLayer) => void;
    public onAddLayer(action: (layer: GameLayer) => void): void {
        this._onAddLayer = action;
    }
    //#endregion

    //#region METHODS
    public update(deltaTime: number): void {
        this.Layers.forEach(layer => layer.update(deltaTime));
    }
    public addLayer(id?: string): GameLayer {
        const layer: GameLayer = new GameLayer(this, id);
        if (this.findLayerById(layer.Id) !== null) {
            throw new Error(`ОШИБКА: ${layer.constructor.name} с идентификатором '${layer.Id}' уже существует.`);
        }
        this.Layers.set(layer.Id, layer);
        this._onAddLayer?.apply(this, [layer]);
        return layer;
    }
    public destroyLayer(id: string): void {
        this.findLayerById(id)?.destroy();
    }
    public findLayerById(id: string): GameLayer | null {
        return this.Layers.get(id) ?? null;
    }
    public destroy(): void {
        this.Layers.forEach(layer => layer.destroy());
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