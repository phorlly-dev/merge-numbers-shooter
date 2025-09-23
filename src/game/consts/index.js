const Instances = {
    game: {
        width: 480,
        height: 600,
        COLS: 7,
        ROWS: 8,
        boot: "game-boot",
        engine: "game-engine",
    },
    sound: {
        key: {},
        value: {},
    },
    colors: [
        { key: "red", hex: 0xe74c3c },
        { key: "blue", hex: 0x3498db },
        { key: "green", hex: 0x2ecc71 },
        { key: "orange", hex: 0xf39c12 },
        { key: "purple", hex: 0x9b59b6 },
    ],
};

export const { game, sound, colors } = Instances;
export const { boot, engine, width, height, COLS, ROWS } = game;
export const { key, value } = sound;
