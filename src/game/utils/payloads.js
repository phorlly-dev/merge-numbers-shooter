import * as Phaser from "phaser";
import { emitEvent } from "../../hooks/remote";
import { COLS, key, ROWS } from "../consts";
import Text from "../objects/Text";
import Tile from "../objects/Tile";
import { applyGravity, levelCompleted } from "./controllers";
import {
    clearBoard,
    colCenterX,
    randomNext,
    rowCenterY,
    showMessage,
} from "./states";

const Payloads = {
    // ----- Spawn wave rows -----
    spawnWave(scene, rows = 2) {
        // Add new rows ONLY at the very top
        for (let c = 0; c < COLS; c++) {
            for (let r = ROWS - rows; r < ROWS; r++) {
                if (scene.grid[c][r]) continue; // skip if already filled

                // Pick values based on level
                const values = [2, 4, 8, 16];
                if (scene.level > 2) values.push(32);
                if (scene.level > 4) values.push(64);

                const val = Phaser.Utils.Array.GetRandom(values);

                const tile = placeTileAt(scene, { col: c, row: r, value: val });

                // Drop animation into the top row (but don't fall further!)
                tile.y = rowCenterY(scene, r) - scene.tileSize * 2;
                scene.tweens.add({
                    targets: tile,
                    y: rowCenterY(scene, r),
                    duration: 400,
                    ease: "Bounce.easeOut",
                });
            }
        }
    },
    placeTileAt(scene, { col, row, value }) {
        const t = new Tile(
            scene,
            colCenterX(scene, col),
            rowCenterY(scene, row),
            value,
            scene.tileSize
        );
        scene.tileLayer.add(t);
        scene.grid[col][row] = t;

        return t;
    },
    checkMerge(scene, col, row) {
        const tile = scene.grid[col][row];
        if (!tile) return;
        const value = tile.value;

        if ((value & (value - 1)) !== 0) return;

        const stack = [[col, row]];
        const cluster = [];
        const visited = new Set();

        while (stack.length > 0) {
            const [c, r] = stack.pop();
            const key = `${c},${r}`;
            if (visited.has(key)) continue;
            visited.add(key);

            const t = scene.grid[c][r];
            if (t && t.value === value) {
                cluster.push([c, r]);
                [
                    [c, r - 1],
                    [c, r + 1],
                    [c - 1, r],
                    [c + 1, r],
                ].forEach(([nc, nr]) => {
                    if (nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS) {
                        stack.push([nc, nr]);
                    }
                });
            }
        }

        if (cluster.length > 1) {
            const [keepC, keepR] = [col, row];

            let rawValue = value * cluster.length;
            let mergedValue = 1;
            while (mergedValue * 2 <= rawValue) mergedValue *= 2;

            for (let [c, r] of cluster) {
                if (c === keepC && r === keepR) continue;
                scene.grid[c][r].destroy();
                scene.grid[c][r] = null;
            }

            scene.scores.current += mergedValue;
            emitEvent("scores", { ...scene.scores });
            scene.sound.play(key.merge);

            const keptTile = scene.grid[keepC][keepR];
            keptTile.setValue(mergedValue);

            playMergeBurst(scene);
            applyGravity(scene);
        } else {
            scene.sound.play(key.wrong);
        }
    },
    checkLevelEnd(scene) {
        if (scene.isGameOver) return;

        if (scene.scores.current >= scene.target) {
            scene.isGameOver = true;
            scene.sound.play(key.win);
            levelCompleted(scene, scene.level);

            // ⏳ Restart safely AFTER cleanup
            scene.time.delayedCall(2500, () => {
                // Clean grid + particles before restart
                clearBoard(scene);

                scene.scene.restart({
                    level: scene.level + 1,
                    total: scene.scores.total + scene.scores.current,
                    remainig_move: scene.moves.current,
                });
            });
        } else if (scene.moves.current <= 0) {
            scene.isGameOver = true;
            const message = showMessage(
                scene,
                "❌ You lose!\n\nTap to play again",
                "#ff0000"
            );
            scene.sound.play(key.lose);
            clearBoard(scene);
            scene.input.once("pointerdown", () => {
                message.destroy();

                // delay restart so Phaser cleans up input events
                scene.time.delayedCall(300, () => {
                    scene.scene.restart({
                        level: scene.level,
                        total: scene.scores.total,
                        remainig_move: 0,
                    });
                });
            });
        }
    },
    showMergeText(scene, word) {
        const txt = new Text(scene, scene.width / 2, scene.height / 2, word, {
            fontSize: "40px",
            fontStyle: "bold",
            color: "#00ff00",
            stroke: "#000",
            strokeThickness: 6,
        });

        scene.tweens.add({
            targets: txt,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 2600,
            ease: "Back.easeOut",
            onComplete: () => txt.destroy(),
        });
    },
    playMergeBurst(scene) {
        showMergeText(
            scene,
            Phaser.Utils.Array.GetRandom([
                "Great!",
                "Perfect!",
                "Awesome!",
                "Fantastic!",
                "Cool!",
            ])
        );

        const emitter = scene.add.particles(
            scene.width / 2,
            scene.height / 2 - scene.tileSize / 2,
            "particle",
            {
                speed: { min: 100, max: 300 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.6, end: 0 },
                alpha: { start: 1, end: 0 },
                lifespan: 600,
                quantity: 10,
                blendMode: "ADD",
            }
        );

        scene.time.delayedCall(600, () => emitter.destroy());
    },
    spawnNextBox(scene) {
        const val = randomNext(scene);
        const col = Math.floor(COLS / 2);
        const x = colCenterX(scene, col);

        scene.currentCol = col;
        scene.currentBox = new Tile(
            scene,
            x,
            scene.bottomY,
            val,
            scene.tileSize
        );
        scene.tileLayer.add(scene.currentBox);
    },
};

export const {
    spawnWave,
    placeTileAt,
    checkMerge,
    checkLevelEnd,
    showMergeText,
    playMergeBurst,
    spawnNextBox,
} = Payloads;
