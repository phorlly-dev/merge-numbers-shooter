import * as Phaser from "phaser";
import { COLS, ROWS } from "../consts";
import Text from "../objects/Text";

const States = {
    // Weighted RNG for next values
    randomNext() {
        const parterns = [2, 4, 8, 16, 32, 64, 32, 16, 8, 4, 2];
        return Phaser.Utils.Array.GetRandom(parterns);
    },
    // Color mapping by value (HSL sweep)
    colorForValue(v) {
        const map = {
            2: 210,
            4: 200,
            8: 190,
            16: 180,
            32: 170,
            64: 160,
            128: 150,
            256: 140,
            512: 130,
            1024: 120,
            2048: 110,
            4096: 100,
        };
        const h = map[v] ?? 90;

        return Phaser.Display.Color.HSLToColor(h / 360, 0.65, 0.54).color;
    },
    colCenterX(scene, col) {
        return scene.boardX + scene.tileSize / 2 + col * scene.tileSize;
    },
    rowCenterY(scene, row) {
        return (
            scene.boardY +
            scene.boardH -
            scene.tileSize / 2 -
            row * scene.tileSize
        );
    },
    clearBoard(scene) {
        // Destroy all tiles + particles safely
        for (let c = 0; c < COLS; c++) {
            for (let r = 0; r < ROWS; r++) {
                if (scene.grid[c][r]) {
                    scene.grid[c][r].destroy();
                    scene.grid[c][r] = null;
                }
            }
        }

        scene.children.list
            .filter((obj) => obj.isParticleEmitterManager)
            .forEach((em) => em.destroy());
    },
    // Define weights depending on level
    getRandomTarget(scene) {
        if (scene.level <= 3) {
            return Phaser.Utils.Array.GetRandom([256, 512, 256]);
        } else if (scene.level <= 6) {
            return Phaser.Utils.Array.GetRandom([256, 512, 1024, 512, 256]);
        } else if (scene.level <= 12) {
            return Phaser.Utils.Array.GetRandom([512, 1024, 2048, 512, 512]);
        } else {
            // higher levels unlock 4096, but rarer
            return Phaser.Utils.Array.GetRandom([512, 1024, 2048, 4096, 1024]);
        }
    },
    showMessage(scene, message, color) {
        const { width, height } = scene.sys.game.config;

        return new Text(scene, width / 2, height / 2, message, {
            fontSize: "28px",
            color,
            fontFamily: "Arial",
            align: "center",
            stroke: "#000000",
            strokeThickness: 3,
        });
    },
};

export const {
    randomNext,
    colorForValue,
    colCenterX,
    rowCenterY,
    clearBoard,
    getRandomTarget,
    showMessage,
} = States;
