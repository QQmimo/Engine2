import { GameLayer, GameScene, GameScreen } from "System/Core";

const screen: GameScreen = new GameScreen(document.body);
const scene: GameScene = screen.addScene();
const layer: GameLayer = scene.addLayer();

const obj_1 = layer.addObject();

screen.play();

console.log(screen);