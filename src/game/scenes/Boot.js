import * as Phaser from "phaser";
import { boot, engine, key, value } from "../consts";

class GameBoot extends Phaser.Scene {
    constructor() {
        super(boot);
    }

    preload() {
        this.load.setPath("assets/");
        this.load.audio(key.click, value.click);
        this.load.audio(key.merge, value.merge);
        this.load.audio(key.wrong, value.wrong);
        this.load.audio(key.lose, value.lose);
        this.load.audio(key.win, value.win);
        this.load.audio(key.music, value.music);
    }

    create() {
        this.scene.start(engine);
    }
}

export default GameBoot;
