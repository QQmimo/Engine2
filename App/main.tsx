import { Dictionary, Drawable, Movable } from "System/Components";
import { GameLayer, GameObject, GameScene, GameScreen } from "System/Core";
import { Random, Size, Vector2D } from "System/Utilities";

const screen: GameScreen = new GameScreen(document.body);
const scene: GameScene = screen.addScene();
const layer: GameLayer = scene.addLayer();

screen.onMouseMove((cursor) => {
    for (let i: number = 0; i < 15; i++) {
        const obj: GameObject = new GameObject(layer);

        obj.addComponent(Drawable);
        obj.addComponent(Movable);
        obj.addComponent(Dictionary);

        const dictionary = obj.getComponent(Dictionary);
        dictionary.set<number>('opacity', Random.Float(1));
        dictionary.set<Size>('size', new Size(Random.Integer(2, 10), 0));
        dictionary.set<Vector2D>('point', cursor);

        obj.Transform.Position = new Vector2D(cursor.X + Random.Integer(-5, 5), cursor.Y + Random.Integer(-5, 5));
        obj.Transform.Size = dictionary.get<Size>('size');
        obj.Transform.Fill = `rgba(51, 51, 51, ${dictionary.get<number>('opacity')})`;

        const movable = obj.getComponent(Movable);
        movable.addForce(new Vector2D(Random.Integer(15), Random.Integer(15)));
    }
});

screen.onUpdate(() => {
    const all: GameObject[] = GameObject.showAll();
    all.forEach(obj => {
        const dict: Dictionary = obj.getComponent(Dictionary);
        const opacity: number = dict.get<number>('opacity') - (Random.Float(10) * 0.001) - 0.001;
        if (opacity < 0) {
            obj.destroy();
        }
        else {
            dict.set('opacity', opacity);
            obj.Transform.Fill = `rgba(51, 51, 51, ${opacity})`;
            obj.getComponent(Movable).addForce(dict.get<Vector2D>('point').subtract(obj.Transform.Position));
        }
    });
});

screen.showFPS();
screen.showEntitiesCount();
screen.play();