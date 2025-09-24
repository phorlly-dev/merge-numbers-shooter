import * as Phaser from "phaser";
import { COLS, engine, key, ROWS } from "../consts";
import { emitEvent, emitEvents, onEvent } from "../../hooks/remote";
import { spawnNextBox, spawnWave } from "../utils/payloads";
import { setupPointer } from "../utils/controllers";
import { colCenterX, getRandomTarget, rowCenterY } from "../utils/states";

class GameEngine extends Phaser.Scene {
    constructor() {
        super(engine);

        // Board/game state
        this.tileSize = 0;
        this.boardX = 0;
        this.boardY = 0;
        this.boardW = 0;
        this.boardH = 0;
        this.bottomY = 0;

        // Current shooter
        this.currentBox = null;
        this.currentCol = 0;
        this.isGameOver = false;

        // Grid
        this.grid = null;

        // Input state
        this.isDragging = false;
        this.hasDragged = false;
        this.dragStartX = 0;

        // Phaser layers
        this.width = 0;
        this.height = 0;
        this.tileLayer = null;
        this.uiLayer = null;
        this.bgLayer = null;
        this.boardG = null;

        // Game stats
        this.level = 1;
        this.target = 0;
        this.scores = { current: 0, total: 0 };
        this.moves = { current: 0, total: 0 };
    }

    // ----- Lifecycle -----
    init(data) {
        this.resetGame(data);

        // clear old events
        if (this.input) this.input.removeAllListeners();
    }

    create() {
        // 🔹 Lifecycle hook
        emitEvent("current-scene-ready", this);
        onEvent("sound", (mute) => {
            this.sound.mute = mute;
            this.sound.play(key.click);
        });

        // display layers so the board never covers tiles after a resize
        this.bgLayer = this.add.layer().setDepth(0);
        this.tileLayer = this.add.layer().setDepth(1);
        this.uiLayer = this.add.layer().setDepth(2);

        // grid state (top-first, ROWS-1 is the top row)
        this.grid = Array.from({ length: COLS }, () => Array(ROWS).fill(null));

        // sizing & board
        this.resizeLayout(this.scale.gameSize);
        this.scale.on("resize", this.resizeLayout, this);

        spawnWave(this);
        spawnNextBox(this);

        // drag input
        setupPointer(this);
        this.sound.play(key.music, { volume: 0.36, loop: true });
    }

    update() {
        this.syncUI();
    }

    // ----- Reset -----
    resetGame(data = {}) {
        this.level = data.level || 1;
        this.scores = { current: 0, total: data.total || 0 };
        this.target = getRandomTarget(this);
        this.moves = this.calculateMoves(data);

        this.isGameOver = false; // ✅ reset flag
    }

    // ----- UI -----
    syncUI() {
        emitEvents({
            events: ["level", "target", "moves", "scores"],
            args: [
                this.level,
                this.target,
                { ...this.moves },
                { ...this.scores },
            ],
        });
    }

    // Safe calculation for moves
    calculateMoves(data = {}) {
        const base = Math.floor(this.target / 24); // baseline moves from target
        const bonus =
            this.level > 1
                ? Math.floor((data.remainig_move || 0) / this.level)
                : 0;

        // clamp so it's never too low or too high
        const total = Phaser.Math.Clamp(base + bonus, 16, 120);

        return { total, current: total };
    }

    // ----- Layout -----
    resizeLayout(size) {
        this.width = size.width;
        this.height = size.height;

        this.tileSize = Math.floor(
            Math.min(this.width / (COLS + 1), this.height / (ROWS + 2))
        );
        this.boardW = this.tileSize * COLS;
        this.boardH = this.tileSize * ROWS;
        this.boardX = Math.round((this.width - this.boardW) / 2);
        this.boardY = Math.round(this.tileSize / 2.5);
        this.bottomY = this.boardY + this.boardH + Math.round(this.tileSize);

        if (this.boardG) this.boardG.destroy();
        this.boardG = this.add.graphics();
        this.bgLayer.add(this.boardG);

        this.boardG.clear();
        this.boardG.fillStyle(0x09131f, 1);
        this.boardG.fillRoundedRect(
            this.boardX - 10,
            this.boardY - 10,
            this.boardW + 20,
            this.boardH + 20,
            16
        );
        this.boardG.fillStyle(0x12243a, 1);
        this.boardG.fillRoundedRect(
            this.boardX,
            this.boardY,
            this.boardW,
            this.boardH,
            14
        );

        this.boardG.lineStyle(
            Math.max(1, Math.floor(this.tileSize * 0.03)),
            0xffffff,
            0.07
        );
        for (let c = 1; c < COLS; c++) {
            const x = this.boardX + c * this.tileSize;
            this.boardG.lineBetween(
                x,
                this.boardY,
                x,
                this.boardY + this.boardH
            );
        }

        // reposition tiles
        if (this.grid) {
            for (let c = 0; c < COLS; c++) {
                for (let r = 0; r < ROWS; r++) {
                    const t = this.grid[c][r];
                    if (!t) continue;
                    t.x = colCenterX(this, c);
                    t.y = rowCenterY(this, r);
                    t.setSizeAndRedraw(this.tileSize);
                    this.tileLayer.add(t);
                }
            }
        }

        // shooter
        if (this.currentBox) {
            this.currentBox.setSizeAndRedraw(this.tileSize);
            this.currentBox.y = this.bottomY;
            this.currentBox.x = colCenterX(
                this,
                this.currentCol ?? Math.floor(COLS / 2)
            );
            this.tileLayer.add(this.currentBox);
        }
    }

    // --- Cleanup when scene stops ---
    shutdown() {
        this.input.removeAllListeners();
        this.sound.stopAll();
    }
}

export default GameEngine;
