import { Dictionary, Drawable, Movable } from "System/Components";
import { GameLayer, GameObject, GameScene, GameScreen } from "System/Core";
import { Random, Size, Vector2D } from "System/Utilities";

const screen: GameScreen = new GameScreen(document.body);
const scene: GameScene = screen.addScene();
const layer: GameLayer = scene.addLayer();

for (let i: number = 0; i < 500; i++) {
    const obj: GameObject = new GameObject(layer);

    obj.addComponent(Drawable);
    obj.addComponent(Movable);
    obj.addComponent(Dictionary);

    obj.getComponent(Dictionary).set<number | null>('timeId', null);

    obj.Transform.Position = Random.Vector2D(screen.Width, screen.Height);
    obj.Transform.Size = new Size(Random.Integer(10, 25), 0);
    obj.Transform.Fill = 'Green';

    const movable = obj.getComponent(Movable);
    movable.Mass = obj.Transform.Size.Width * 2;
    movable.IsCollidable = true;

    movable.addForce(Random.Vector2D(Random.Integer(-25, 25), Random.Integer(-25, 25)));

    movable.onCollision(object => {
        let timeId: number | null = object.getComponent(Dictionary).get<number | null>('timeId');
        if (timeId !== null) {
            clearTimeout(timeId);
            object.Transform.Fill = 'Green';
        }
        object.Transform.Fill = 'Red';
        timeId = setTimeout(() => {
            object.Transform.Fill = 'Green';
        }, 250);
        object.getComponent(Dictionary).set<number>('timeId', timeId);
    });
}

const centerPoint: Vector2D = new Vector2D(screen.Width / 2, screen.Height / 2);
const all: GameObject[] = GameObject.selectByComponent(Movable)
    .filter(o => o.getComponent(Movable).IsCollidable);

screen.onUpdate(() => {
    screen.Context!.beginPath();
    screen.Context!.arc(centerPoint.X, centerPoint.Y, 10, 0, 360);
    screen.Context!.fillStyle = 'Black';
    screen.Context!.fill();
    screen.Context!.closePath();

    all.forEach(obj => {
        if (obj.Transform.Position.distance(centerPoint) > 250) {
            obj.getComponent(Movable).addForce(centerPoint.subtract(obj.Transform.Position).normalize().multiply(1 / 1000));
        }
        else {
            screen.Context!.beginPath();
            screen.Context!.moveTo(obj.Transform.Position.X, obj.Transform.Position.Y);
            screen.Context!.lineTo(centerPoint.X, centerPoint.Y);
            screen.Context!.strokeStyle = 'rgba(51, 51, 51, 0.25)';
            screen.Context!.stroke();
            screen.Context!.closePath();
        }

        screen.Context!.beginPath();
        screen.Context!.moveTo(obj.Transform.Position.X, obj.Transform.Position.Y);
        screen.Context!.lineTo(obj.Transform.Position.X + obj.getComponent(Movable).Velocity.X, obj.Transform.Position.Y + obj.getComponent(Movable).Velocity.Y);
        screen.Context!.strokeStyle = 'Black';
        screen.Context!.stroke();
        screen.Context!.closePath();
    });
});

screen.showFPS();
screen.showEntitiesCount();
screen.play();