import { BaseObject, GameScene } from "..";

export class GameScreen extends BaseObject {
    constructor(target: HTMLElement, name?: string, _width?: number, _height?: number) {
        super(name ?? `GameScreen_${GameScreen.showAll().length + 1}`);
        this.Scenes = new Map<string, GameScene>();
        this._Canvas = document.createElement('canvas');
        this.Context = this._Canvas.getContext('2d');
        target.appendChild(this._Canvas);

        this._setSize();
        window.addEventListener('resize', () => {
            this._setSize();
        });
    }

    private _setSize(): void {
        this._Canvas.width = innerWidth;
        this._Canvas.height = innerHeight;
        this._Canvas.style.cssText = 'position: absolute; top: 0; left: 0;';
    }
    private _LastTime: number = 0;
    private _Loop: number = 0;

    //#region FIELDS
    private readonly Scenes: Map<string, GameScene>;
    private readonly _Canvas: HTMLCanvasElement;
    public readonly Context: CanvasRenderingContext2D | null;
    public get Width(): number {
        return this._Canvas.width;
    }
    public get Height(): number {
        return this._Canvas.height;
    }
    //#endregion

    //#region EVENTS
    private _onAddScene?: (scene: GameScene) => void;
    public onAddScene(action: (scene: GameScene) => void): void {
        this._onAddScene = action;
    }
    //#endregion

    //#region METHODS
    public addScene(name?: string): GameScene {
        const scene: GameScene = new GameScene(this, name);
        if (this.findSceneById(scene.Id) !== null) {
            throw new Error(`ОШИБКА: ${scene.constructor.name} с идентификатором '${scene.Id}' уже существует.`);
        }
        this.Scenes.set(scene.Id, scene);
        this._onAddScene?.apply(this, [scene]);
        return scene;
    }
    public destroyScene(id: string): void {
        GameScene.findById(id)?.destroy();
    }
    public findSceneById(id: string): GameScene | null {
        return this.Scenes.get(id) ?? null;
    }
    public update(deltaTime: number): void {
        this.Context?.clearRect(0, 0, this.Width, this.Height);
        this.Scenes
            .forEach(scene => {
                scene.update(deltaTime);
                this.Context?.restore();
            });
    }
    public play = (currentTime: number = 0): void => {
        const deltaTime = (currentTime - this._LastTime) / 1000;
        this._LastTime = currentTime;
        this.update(deltaTime);
        this._Loop = requestAnimationFrame(this.play);
    }
    public pause(): void {
        cancelAnimationFrame(this._Loop);
    }
    public destroy(): void {
        this._Canvas.parentElement?.removeChild(this._Canvas);
        this.Scenes.forEach(scene => scene.destroy());
        super.destroy();
    }
    //#endregion

    //#region GLOBAL
    public static findById(id: string): GameScreen | null {
        return super.findById(id) as GameScreen;
    }
    public static findByName(name: string): GameScreen | null {
        return super.findByName(name) as GameScreen;
    }
    public static selectByTag(tag: string): GameScreen[] {
        return super.selectByTag(tag) as GameScreen[];
    }
    public static showAll(): GameScreen[] {
        return this.AllAsArray as GameScreen[];
    }
    //#endregion
}