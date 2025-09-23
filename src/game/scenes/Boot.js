import * as Phaser from "phaser";
import { boot, engine } from "../consts";

class GameBoot extends Phaser.Scene {
    constructor() {
        super(boot);
    }

    preload() {
        this.load.setPath("assets/");
        this.load.audio("click", "/audios/click.mp3");
        this.load.audio("merge", "/audios/connect.ogg");
        this.load.audio("wrong", "/audios/empty.ogg");
        this.load.audio("lose", "/audios/lose.wav");
        this.load.audio("win", "/audios/win.ogg");
        this.load.audio("music", "/audios/bg_music.ogg");
    }

    create() {
        this.scene.start(engine);
    }
}

export default GameBoot;
