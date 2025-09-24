import * as React from "react";

const Footer = ({ maxWidth }) => {
    React.useEffect(() => {}, []);

    return (
        <footer
            className="w-100 bg-light text-dark text-center p-2 shadow-sm"
            style={{
                maxWidth: maxWidth,
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
            }}
        >
            <p className="small fw-medium">
                Drag the number box{" "}
                <span className="text-primary fw-semibold text-capitalize me-1">
                    left or right
                </span>
                and release to shoot.
                <span className="ms-1 text-secondary">
                    Merge the same numbers to increase your score!
                </span>
            </p>
        </footer>
    );
};

export default Footer;
