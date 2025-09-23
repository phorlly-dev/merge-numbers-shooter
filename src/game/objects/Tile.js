import { colorForValue } from "../utils/states";

class Tile extends Phaser.GameObjects.Container {
    constructor(scene, x, y, value, size) {
        super(scene, x, y);
        this.value = value;
        this.size = size;

        this.g = scene.add.graphics();
        this.label = scene.add
            .text(0, 0, String(value), {
                fontSize: Math.max(14, Math.floor(size * 0.42)),
                color: "#fff",
                stroke: "#000",
                strokeThickness: Math.max(2, Math.floor(size * 0.06)),
            })
            .setOrigin(0.5);

        this.add([this.g, this.label]);
        this.redraw();
    }

    setValue(v) {
        this.value = v;
        this.label.setText(String(v));
        this.redraw();
    }

    setSizeAndRedraw(size) {
        this.size = size;
        this.label.setFontSize(Math.max(14, Math.floor(size * 0.42)));
        this.label.setStroke("#000", Math.max(2, Math.floor(size * 0.06)));
        this.redraw();
    }

    redraw() {
        const s = this.size - Math.max(4, this.size * 0.08);
        const r = Math.max(8, Math.floor(this.size * 0.2));
        this.g.clear();
        this.g.fillStyle(colorForValue(this.value), 1);
        this.g.fillRoundedRect(-s / 2, -s / 2, s, s, r);
    }
}

export default Tile;
