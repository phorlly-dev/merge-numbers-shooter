import * as React from "react";
import { emitEvent, offEvents, onEvents } from "../hooks/remote";
import { formatNumber } from "../hooks/format";

const Header = () => {
    const [muted, setMuted] = React.useState(false);
    const [scores, setScores] = React.useState({ current: 0, total: 0 });
    const [moves, setMoves] = React.useState({ current: 0, total: 0 });
    const [target, setTarget] = React.useState(0);
    const [level, setLevel] = React.useState(1);

    // Listen for Phaser events and update state
    React.useEffect(() => {
        const events = ["scores", "moves", "target", "level"];
        const callbacks = [
            (data = {}) => setScores({ ...data }),
            (data = {}) => setMoves({ ...data }),
            (data = 0) => setTarget(data),
            (data = 1) => setLevel(data),
        ];

        onEvents({ events, callbacks });
        return () => offEvents({ events, callbacks });
    }, [scores, moves, target, level]);

    const toggle = () => {
        const newMute = !muted;
        setMuted(newMute);
        emitEvent("sound", newMute);
    };

    return (
        <header
            className="w-100 px-4 py-2 bg-light shadow-sm"
            style={{
                maxWidth: "480px",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
            }}
        >
            {/* First Row */}
            <section className="d-flex align-items-center justify-content-between">
                <span className="text-muted">
                    Score:
                    <span className="text-success fw-semibold fs-6 ms-1">
                        {scores.current}
                    </span>
                </span>

                <span className="text-muted">
                    Level:
                    <span className="text-warning fw-semibold fs-6 ms-1">
                        {level}
                    </span>
                </span>

                <button
                    onClick={toggle}
                    title="Toggle sound on/off"
                    aria-label="Toggle sound"
                    className={`btn btn-sm rounded-circle shadow ${
                        muted ? "btn-dark" : "btn-success"
                    }`}
                >
                    <i
                        className={`fa ${
                            muted ? "fa-volume-mute" : "fa-volume-up"
                        }`}
                    ></i>
                </button>
            </section>

            {/* Second Row */}
            <section className="d-flex align-items-center justify-content-between mt-3">
                <span className="text-muted">
                    Moves:
                    <span className="text-danger fw-semibold ms-1">
                        {moves.current}/
                        <b className="text-primary">{moves.total}</b>
                    </span>
                </span>

                {scores.total > 0 && (
                    <span className="text-muted">
                        Total:
                        <span className="text-info fw-bold ms-1">
                            {formatNumber(scores.total)}
                        </span>
                    </span>
                )}

                <span className="text-muted">
                    Target:
                    <span className="text-primary fw-bold ms-1">{target}</span>
                </span>
            </section>
        </header>
    );
};

export default Header;
