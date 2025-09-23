import * as React from "react";
import { offEvent, onEvent } from "../hooks/remote";
import StartGame from "../game";

const PhaserGame = React.forwardRef(({ player }, ref) => {
    const game = React.useRef();

    // Create the game inside a useLayoutEffect hook to avoid the game being created outside the DOM
    React.useLayoutEffect(() => {
        if (game.current === undefined) {
            game.current = StartGame("game-container");

            if (ref !== null) {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = undefined;
            }
        };
    }, [ref]);

    React.useEffect(() => {
        const handleSceneReady = (scene) => {
            if (ref) ref.current.scene = scene;
            scene.player = player;
        };

        onEvent("current-scene-ready", handleSceneReady);
        return () => offEvent("current-scene-ready", handleSceneReady);
    }, [player, ref]);

    return <div id="game-container"></div>;
});

export default PhaserGame;
