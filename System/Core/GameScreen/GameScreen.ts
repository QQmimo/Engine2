import { BaseObject, GameScene } from "..";

export class GameScreen extends BaseObject {
    constructor(target: HTMLElement, name?: string, width?: number, height?: number) {
        super(name);
        this.Scenes = new Map<string, GameScene>();
        this._Canvas = document.createElement('canvas');
        this._Context = this._Canvas.getContext('2d');
        target.appendChild(this._Canvas);

        this._setSize(width, height);

        window.addEventListener('resize', (e) => {
            this._setSize(innerWidth, innerHeight);
        });
    }

    private _setSize(width?: number, height?: number): void {
        if (width !== undefined && width !== null) {
            this._Canvas.width = width!;
        }
        else {
            this._Canvas.width = this._Canvas.parentElement!.offsetWidth;
        }
        if (height !== undefined && height !== null) {
            this._Canvas.height = height!;
        }
        else {
            this._Canvas.height = this._Canvas.parentElement!.offsetHeight;
        }
    }
    private _LastTime: number = 0;
    private _Loop: number = 0;

    //#region FIELDS
    private readonly Scenes: Map<string, GameScene>;
    private get ScenesAsArray(): GameScene[] {
        return Array.from(this.Scenes, ([key, value]) => value);
    }
    private readonly _Canvas: HTMLCanvasElement;
    private readonly _Context: CanvasRenderingContext2D | null;
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
        const scene: GameScene = new GameScene(name);
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
        this._Context?.clearRect(0, 0, this.Width, this.Height);
        this.ScenesAsArray
            .forEach(scene => {
                scene.update(deltaTime);
                this._Context?.restore();
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
    public static findByTag(tag: string): GameScreen[] {
        return super.findByTag(tag) as GameScreen[];
    }
    public static showAll(): GameScreen[] {
        return this.AllAsArray as GameScreen[];
    }
    //#endregion
}