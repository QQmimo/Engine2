import { Drawed, Moved, Physic } from "System/Components";
import { GameLayer, GameObject, GameScene, GameScreen } from "System/Core";
import { Random, Size } from "System/Utilities";

const screen: GameScreen = new GameScreen(document.body);
const scene: GameScene = screen.addScene();
const layer: GameLayer = scene.addLayer();

for (let i: number = 0; i < 350; i++) {
    const obj: GameObject = new GameObject(layer);
    obj.Transform.Position = Random.Vector2D(screen.Width, screen.Height);
    obj.Transform.Size = new Size(Random.Integer(5, 25), 0);
    obj.Transform.Fill = "#0f0";
    obj.addComponent(Drawed);
    obj.addComponent(Moved);
    obj.addComponent(Physic);

    const obj_moved = obj.getComponent(Moved);
    obj_moved.Speed = 25;
    obj_moved.Target = Random.Vector2D(screen.Width, screen.Height);
    obj_moved.onFinish((_o, c) => {
        c.Target = Random.Vector2D(screen.Width, screen.Height);
    });

    const obj_physic: Physic = obj.getComponent(Physic);
    obj_physic.Mass = Random.Integer(obj.Transform.Size.Width, 25);
    obj_physic.onCollision((o) => {
        o.Transform.Fill = "#f00";
        setTimeout(() => {
            o.Transform.Fill = "grey";
        }, 200);
        setTimeout(() => {
            o.getComponent(Moved).Target = Random.Vector2D(screen.Width, screen.Height);
            o.Transform.Fill = "#0f0";
        }, 2000);
    });
}

screen.play();