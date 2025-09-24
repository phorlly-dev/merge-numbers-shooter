import * as Phaser from "phaser";
class Text extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style) {
        super(scene, x, y, text, style);
        this.setOrigin(0.5);
        scene.add.existing(this);
    }
}

export default Text;
