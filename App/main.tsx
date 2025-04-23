import { Dictionary, Drawable, Movable } from "System/Components";
import { GameLayer, GameObject, GameScene, GameScreen } from "System/Core";
import { Random, Size, Vector2D } from "System/Utilities";

const screen: GameScreen = new GameScreen(document.body);
const scene: GameScene = screen.addScene();
const layer: GameLayer = scene.addLayer();

let points: Vector2D[] = [];
let movablePoint: Vector2D | null = null;
let damage: number = 15;

screen.onClick(cursor => {
    points.push(cursor);
});

screen.onMouseMove(cursor => {
    movablePoint = cursor;
});

screen.onUpdate(() => {
    [...points, movablePoint].filter(p => p !== null).forEach(point => {
        for (let i: number = 0; i < damage; i++) {
            const obj: GameObject = new GameObject(layer);

            obj.addComponent(Drawable);
            obj.addComponent(Movable);
            obj.addComponent(Dictionary);

            const dictionary = obj.getComponent(Dictionary);
            dictionary.set<number>('opacity', Random.Float(0.35) + 0.05);
            dictionary.set<Size>('size', new Size(Random.Integer(2, 10), 0));
            dictionary.set<Vector2D>('point', point);

            obj.Transform.Position = new Vector2D(point.X + Random.Integer(-5, 5), point.Y + Random.Integer(-5, 5));
            obj.Transform.Size = dictionary.get<Size>('size');
            obj.Transform.Fill = `rgba(183, 183, 183, ${dictionary.get<number>('opacity')})`;

            const movable = obj.getComponent(Movable);
            movable.addForce(new Vector2D(Random.Integer(15), Random.Integer(15)));
            movable.addForce(new Vector2D(0, Random.Integer(-150, -100)));
        }
    });

    const all: GameObject[] = GameObject.showAll();
    all.forEach(obj => {
        const dict: Dictionary = obj.getComponent(Dictionary);
        const opacity: number = dict.get<number>('opacity') - (Random.Float(1) * 0.005) - 0.0001;
        const size: Size = dict.get<Size>('size');
        if (opacity < 0 || size.Width < 0) {
            obj.destroy();
        }
        else {
            dict.set('opacity', opacity);
            obj.Transform.Fill = `rgba(183, 183, 183, ${opacity})`;
            if (Random.Integer(1) === 1) {
                obj.getComponent(Movable).addForce(obj.Transform.Position.subtract(dict.get<Vector2D>('point')));
            }
        }
    });
});

screen.showFPS();
screen.showEntitiesCount();
screen.play();