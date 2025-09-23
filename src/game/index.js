import * as Phaser from "phaser";
import GameEngine from "./scenes/Game";
import GameBoot from "./scenes/Boot";
import { height, width } from "./consts";

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: Phaser.AUTO,
    backgroundColor: "#0b0b0b",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: width,
        height: height,
    },
    physics: { default: "arcade" },
    scene: [GameBoot, GameEngine],
};

const StartGame = (parent) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;
