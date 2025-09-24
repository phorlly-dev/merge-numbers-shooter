import * as Phaser from "phaser";
import GameEngine from "./scenes/Game";
import GameBoot from "./scenes/Boot";
import { height, width } from "./consts";

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: Phaser.AUTO,
    backgroundColor: "#000",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: width,
        height: height,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
        },
    },
    render: {
        pixelArt: false, // smooth scaling
        antialias: true, // prevent blurry text edges
    },
    scene: [GameBoot, GameEngine],
};

const StartGame = (parent) => new Phaser.Game({ ...config, parent });

export default StartGame;
