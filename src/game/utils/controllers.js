import { emitEvent } from "../../hooks/remote";
import { COLS, ROWS } from "../consts";
import { checkLevelEnd, checkMerge, spawnNextBox } from "./payloads";
import { colCenterX, rowCenterY, showMessage } from "./states";

const Controllers = {
    shootBox(scene) {
        if (scene.isGameOver) return; // 🚫 stop if game over

        const col = scene.currentCol;

        let targetRow = -1;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (!scene.grid[col][r]) {
                targetRow = r;
                break;
            }
        }

        if (targetRow < 0) {
            scene.currentBox.destroy();
            scene.currentBox = null;
            if (!scene.isGameOver) spawnNextBox(scene); // ✅ only if game still running
            return;
        }

        const targetY = rowCenterY(scene, targetRow);

        scene.moves.current--;
        emitEvent("moves", { ...scene.moves });

        scene.tweens.add({
            targets: scene.currentBox,
            y: targetY,
            duration: 420,
            ease: "Quad.easeOut",
            onComplete: () => {
                scene.grid[col][targetRow] = scene.currentBox;
                checkMerge(scene, col, targetRow);
                scene.currentBox = null;
                checkLevelEnd(scene);
                if (!scene.isGameOver) spawnNextBox(scene); // ✅ only if game still running
            },
        });
    },
    applyGravity(scene) {
        for (let c = 0; c < COLS; c++) {
            let writeRow = ROWS - 1;
            for (let r = ROWS - 1; r >= 0; r--) {
                if (scene.grid[c][r]) {
                    if (r !== writeRow) {
                        const tile = scene.grid[c][r];
                        scene.grid[c][r] = null;
                        scene.grid[c][writeRow] = tile;

                        scene.tweens.add({
                            targets: tile,
                            y: rowCenterY(scene, writeRow),
                            duration: 200,
                            ease: "Quad.easeOut",
                        });
                    }
                    writeRow--;
                }
            }
        }
    },
    levelCompleted(scene, level) {
        const message = showMessage(
            scene,
            `🎉 You Win!\nLevel ${level} Completed!`,
            "#00ff00"
        );

        scene.tweens.add({
            targets: message,
            scale: 1.2,
            duration: 800,
            yoyo: true,
            repeat: 2,
            ease: "Sine.easeInOut",
            onComplete: () => message.destroy(),
        });

        // Emitters go into one ParticleManager, easier cleanup
        const emitter = scene.add.particles(0, 0, "particle", {
            x: { min: 0, max: scene.sys.game.config.width },
            y: 0,
            lifespan: 1500,
            speedY: { min: 200, max: 400 },
            scale: { start: 0.6, end: 0 },
            quantity: 4,
            blendMode: "ADD",
            tint: [0xff4757, 0x2ed573, 0x1e90ff, 0xffd32a, 0xeccc68],
        });

        scene.time.delayedCall(2000, () => {
            if (emitter) {
                emitter.stop();
                emitter.destroy();
            }
        });
    },
    makeMoveBox(scene, pointerX) {
        let col = Phaser.Math.Clamp(
            Math.floor((pointerX - scene.boardX) / scene.tileSize),
            0,
            COLS - 1
        );
        scene.currentCol = col;
        scene.currentBox.x = colCenterX(scene, col);
    },
    setupPointer(scene) {
        scene.input.on("pointerdown", (p) => {
            if (
                scene.currentBox &&
                Phaser.Math.Distance.Between(
                    p.x,
                    p.y,
                    scene.currentBox.x,
                    scene.currentBox.y
                ) < scene.tileSize
            ) {
                scene.isDragging = true;
                scene.hasDragged = false;
                scene.dragStartX = p.x;
                scene.input.setDefaultCursor("grabbing");
            }
        });

        scene.input.on("pointermove", (p) => {
            if (scene.isDragging && scene.currentBox) {
                if (Math.abs(p.x - scene.dragStartX) > 10)
                    scene.hasDragged = true;
                makeMoveBox(scene, p.x);
            }
        });

        scene.input.on("pointerup", () => {
            scene.input.setDefaultCursor("default");
            if (scene.currentBox && scene.hasDragged) shootBox(scene);
            scene.isDragging = false;
            scene.hasDragged = false;
        });
    },
};

export const {
    shootBox,
    applyGravity,
    levelCompleted,
    makeMoveBox,
    setupPointer,
} = Controllers;
