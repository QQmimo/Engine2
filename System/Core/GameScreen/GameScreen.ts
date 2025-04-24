import { Vector2D } from "System/Utilities";
import { BaseObject, GameEngine, GameObject, GameScene } from "..";

export class GameScreen extends BaseObject {
    constructor(target: HTMLElement, name?: string, _width?: number, _height?: number) {
        super(name ?? `GameScreen_${GameScreen.showAll().length + 1}`);
        this.Scenes = new Map<string, GameScene>();
        this.Canvas = document.createElement('canvas');
        this.Context = this.Canvas.getContext('2d');
        target.appendChild(this.Canvas);

        this._setSize();
        window.addEventListener('resize', () => {
            this._setSize();
        });

        this.Canvas.addEventListener('click', e => {
            this._onClick?.apply(this, [new Vector2D(e.clientX, e.clientY), this]);
        });

        this.Canvas.addEventListener('contextmenu', e => {
            this._onRightClick?.apply(this, [new Vector2D(e.clientX, e.clientY), this]);
            e.preventDefault();
        });

        this.Canvas.addEventListener('mousemove', e => {
            this._onMouseMove?.apply(this, [new Vector2D(e.clientX, e.clientY), this]);
        });

        this.Canvas.addEventListener('keypress', e => {
            this._onKeyPress?.apply(this, [e.key]);
            e.preventDefault();
        });

        this._GameEngine = new GameEngine();
        this._GameEngine.setGrid(150, 150, this.Width, this.Height);
    }

    private _setSize(): void {
        this.Canvas.width = innerWidth;
        this.Canvas.height = innerHeight;
        this.Canvas.style.cssText = 'position: absolute; top: 0; left: 0;';
    }
    private _LastTime: number = 0;
    private _Loop: number = 0;
    private _GameEngine: GameEngine;

    //#region FIELDS
    private readonly Scenes: Map<string, GameScene>;
    public readonly Canvas: HTMLCanvasElement;
    public readonly Context: CanvasRenderingContext2D | null;
    public get Width(): number {
        return this.Canvas.width;
    }
    public get Height(): number {
        return this.Canvas.height;
    }
    //#endregion

    //#region EVENTS
    private _onAddScene?: (scene: GameScene) => void;
    public onAddScene(action: (scene: GameScene) => void): void {
        this._onAddScene = action;
    }
    private _onClick?: (cursor: Vector2D, scene: GameScreen) => void;
    public onClick(action: (cursor: Vector2D, scene: GameScreen) => void): void {
        this._onClick = action;
    }
    private _onRightClick?: (cursor: Vector2D, scene: GameScreen) => void;
    public onRightClick(action: (cursor: Vector2D, scene: GameScreen) => void): void {
        this._onRightClick = action;
    }
    private _onMouseMove?: (cursor: Vector2D, scene: GameScreen) => void;
    public onMouseMove(action: (cursor: Vector2D, scene: GameScreen) => void): void {
        this._onMouseMove = action;
    }
    private _onKeyPress?: (key: string) => void;
    public onKeyPress(action: (key: string) => void): void {
        this._onKeyPress = action;
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
        this._GameEngine.update(deltaTime);
        this.Context?.clearRect(0, 0, this.Width, this.Height);

        this._GameEngine.Areas.forEach(area => {
            this.Context?.restore();
            this.Context!.beginPath();
            this.Context!.strokeRect(area.minX, area.minY, area.maxX - area.minX, area.maxY - area.minY);
            this.Context!.strokeStyle = 'rgba(255, 125, 0, 0.5)';
            this.Context!.stroke();
            this.Context!.closePath();
        });

        this.Scenes
            .forEach(scene => {
                scene.update(deltaTime);
                this.Context?.restore();
            });
        this._onUpdate?.apply(this, [deltaTime]);
        if (this._IsShowFPS) {
            this.Context!.beginPath();
            this.Context!.globalAlpha = 0.75;
            this.Context!.fillStyle = 'black';
            this.Context!.fillRect(10, 10, 70, 24);
            this.Context!.closePath();
            this.Context!.beginPath();
            this.Context!.globalAlpha = 1;
            this.Context!.textAlign = 'left';
            this.Context!.strokeStyle = '#00fb00';
            this.Context!.textBaseline = 'middle';
            this.Context!.font = 'lighter 18px sans-serif';
            this.Context!.fillStyle = '#00fb00';
            this.Context!.fillText(`FPS: ${this._onShowFPS()}`, 12, 22, 70);
            this.Context!.closePath();
        }
        if (this._IsShowEntitiesCount) {
            this.Context!.beginPath();
            this.Context!.globalAlpha = 0.75;
            this.Context!.fillStyle = 'black';
            this.Context!.fillRect(10, 35, 100, 24);
            this.Context!.closePath();
            this.Context!.beginPath();
            this.Context!.globalAlpha = 1;
            this.Context!.textAlign = 'left';
            this.Context!.strokeStyle = '#00fb00';
            this.Context!.font = 'lighter 18px sans-serif';
            this.Context!.fillStyle = '#00fb00';
            this.Context!.fillText(`Count: ${GameObject.AllAsArray.length}`, 12, 47);
            this.Context!.closePath();
        }
    }
    public play = (currentTime: number = 0): void => {
        const deltaTime = (currentTime - this._LastTime) / 1000;
        this._LastTime = currentTime;
        this.update(deltaTime);
        this._Loop = requestAnimationFrame(this.play);
    }
    public pause = (): void => {
        cancelAnimationFrame(this._Loop);
    }
    private _IsShowFPS: boolean = false;
    private _Times: number[] = [];
    private _onShowFPS = (): number => {
        const now: number = performance.now();
        while (this._Times.length > 0 && this._Times[0] <= now - 1000) {
            this._Times.shift();
        }
        this._Times.push(now);
        return this._Times.length;
    }
    public showFPS = (flag: boolean = true): void => {
        this._IsShowFPS = flag;
    }
    private _IsShowEntitiesCount: boolean = false;
    public showEntitiesCount = (flag: boolean = true): void => {
        this._IsShowEntitiesCount = flag;
    }
    public destroy(): void {
        this.Canvas.parentElement?.removeChild(this.Canvas);
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