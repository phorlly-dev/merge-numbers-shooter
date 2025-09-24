import * as React from "react";

// Lazy load the Phaser game
const PhaserGame = React.lazy(() => import("./PhaserGame"));
const Header = React.lazy(() => import("./Header"));
const Footer = React.lazy(() => import("./Footer"));

const Content = ({ player, onLogout }) => {
    const phaserRef = React.useRef();

    return (
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
            <section className="text-light mb-2">
                <span className="mb-0 h6">
                    Welcome{" "}
                    <b className="text-info fs-6 text-capitalize">{player}</b>,
                    enjoy the game.
                </span>
                <button
                    onClick={onLogout}
                    title="Exit from game"
                    aria-label="Exit"
                    className="btn btn-danger btn-sm rounded-circle shadow ms-2"
                >
                    <i className="fa fa-power-off"></i>
                </button>
            </section>
            <section className="d-flex flex-column align-items-center">
                {/* 🔹 Header */}
                <Header />

                {/* 🔹 Game Board (Phaser) */}
                <main
                    className="bg-dark d-flex justify-content-center align-items-center"
                    style={{
                        width: "100%",
                        maxWidth: "480px",
                    }}
                >
                    <PhaserGame
                        ref={phaserRef}
                        player={player}
                        style={{ width: "100%", height: "100%" }}
                    />
                </main>

                {/* 🔹 Footer */}
                <Footer />
            </section>
        </div>
    );
};

export default Content;
