import { Drawable, Movable } from "System/Components";
import { GameLayer, GameObject, GameScene, GameScreen } from "System/Core";
import { Random, Size, Vector2D } from "System/Utilities";

const screen: GameScreen = new GameScreen(document.body);
const scene: GameScene = screen.addScene();
const layer: GameLayer = scene.addLayer();

for (let i: number = 0; i < 2500; i++) {
    const obj: GameObject = new GameObject(layer);

    obj.addComponent(Drawable);
    obj.addComponent(Movable);

    obj.Transform.Position = Random.Vector2D(0, screen.Width, 0, screen.Height);
    obj.Transform.Size = new Size(Random.Integer(5, 10), 0);
    obj.Transform.Fill = 'Green';

    const movable = obj.getComponent(Movable);
    movable.Mass = obj.Transform.Size.Width * 5;
    movable.IsCollidable = true;
    movable.onStoped((_o, c) => {
        c.addForce(new Vector2D(Random.Integer(-50, 50), Random.Integer(-50, 50)));
    });

    movable.addForce(new Vector2D(Random.Integer(-50, 50), Random.Integer(-50, 50)));
}

const centerPoint: Vector2D = new Vector2D(screen.Width / 2, screen.Height / 2);
const all: GameObject[] = GameObject.selectByComponent(Movable)
    .filter(o => o.getComponent(Movable).IsCollidable);
screen.setGridSize(75, 75);

screen.onUpdate(() => {
    all.forEach(obj => {
        // screen.Context!.beginPath();
        // screen.Context!.moveTo(obj.Transform.Position.X, obj.Transform.Position.Y);
        // screen.Context!.lineTo(obj.Transform.Position.X + obj.getComponent(Movable).Velocity.X, obj.Transform.Position.Y + obj.getComponent(Movable).Velocity.Y);
        // screen.Context!.lineWidth = 1;
        // screen.Context!.strokeStyle = 'rgba(0, 0, 0, 1)';
        // screen.Context!.stroke();
        // screen.Context!.closePath();     

        if (obj.Transform.Position.distance(centerPoint) > 1000) {
            obj.getComponent(Movable).addForce(obj.Transform.Position.subtract(centerPoint).multiply(-10).normalize());
        }
    });
});

screen.showFPS();
screen.showEntitiesCount();
screen.play();