import { Drawed, Moved, Physic } from "System/Components";
import { GameLayer, GameObject, GameScene, GameScreen } from "System/Core";
import { Random, Size, Vector2D } from "System/Utilities";

const screen: GameScreen = new GameScreen(document.body);
const scene: GameScene = screen.addScene();
const layer: GameLayer = scene.addLayer();

screen.Canvas.onclick = (e) => {
    const black: GameObject = new GameObject(layer);
    black.addTag('black hole');
    black.Transform.Position = new Vector2D(e.clientX, e.clientY);
    black.Transform.Fill = 'black';
    black.Transform.Size = new Size(5, 0);
    black.addComponent(Drawed);
    black.addComponent(Physic);
    const physic: Physic = black.getComponent(Physic);
    physic.Mass = Infinity;
    physic.Flex = 0;
    black.addComponent(Moved);
    black.onUpdate(() => {
        const all: GameObject[] = GameObject.selectByComponent(Physic);
        all.forEach(o => {
            const distance: number = black.Transform.Position.distance(o.Transform.Position);
            o.getComponent(Moved).Velocity = new Vector2D(
                (black.Transform.Position.X - o.Transform.Position.X) / (distance * distance + 0.01),
                (black.Transform.Position.Y - o.Transform.Position.Y) / (distance * distance + 0.01)
            );
        });
    });
}
screen.Canvas.oncontextmenu = (e => {
    e.preventDefault();
    const oldBlack: GameObject[] = GameObject.selectByTag('black hole');
    oldBlack.forEach(old => old.destroy());
});

for (let i: number = 0; i < 500; i++) {
    const obj: GameObject = new GameObject(layer);
    obj.Transform.Position = Random.Vector2D(screen.Width, screen.Height);
    obj.Transform.Size = new Size(Random.Integer(2, 10), 0);
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
    physic.Mass = obj.Transform.Size.Width * obj.Transform.Size.Width;
    physic.onCollision(o => {
        if (!o.Tags.includes('black hole')) {
            o.Transform.Fill = 'red';
            setTimeout(() => { o.Transform.Fill = 'green'; }, 200);
        }
    });
}

screen.play();