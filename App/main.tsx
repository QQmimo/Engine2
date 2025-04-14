import { Drawed, Moved, Physic } from "System/Components";
import { GameLayer, GameObject, GameScene, GameScreen } from "System/Core";
import { Random, Size } from "System/Utilities";

const screen: GameScreen = new GameScreen(document.body);
const scene: GameScene = screen.addScene();
const layer: GameLayer = scene.addLayer();

for (let i: number = 0; i < 500; i++) {
    const obj: GameObject = new GameObject(layer);
    obj.Transform.Position = Random.Vector2D(screen.Width, screen.Height);
    obj.Transform.Size = new Size(Random.Integer(5, 15), 0);
    obj.Transform.Fill = "green";
    obj.addComponent(Drawed);
    obj.addComponent(Moved);
    obj.addComponent(Physic);

    const moved = obj.getComponent(Moved);
    moved.Speed = 25;
    moved.Target = Random.Vector2D(screen.Width, screen.Height);
    moved.onFinish((_o, c) => {
        c.Target = Random.Vector2D(screen.Width, screen.Height);
    });

    const physic: Physic = obj.getComponent(Physic);
    physic.Mass = obj.Transform.Size.Width;
    physic.onCollision((o) => {
        o.Transform.Fill = "red";
        setTimeout(() => {
            o.Transform.Fill = "green";
        }, 200);
    });
}

screen.play();