import * as React from "react";
import Auth from "./components/Auth";

const Content = React.lazy(() => import("./components/Content"));
const Banner = React.lazy(() => import("./components/Banner"));
const App = () => {
    const [showBanner, setShowBanner] = React.useState(true);
    const [loading, setLoading] = React.useState(true);
    const [player, setPlayer] = React.useState(null);

    // Load from Firebase when player logs in
    const handleAuth = async (name) => {
        setPlayer(name);
        localStorage.setItem("player", name);
        setLoading(false);
        setShowBanner(true);
    };

    // Load game data when player logs in
    React.useEffect(() => {
        const savedName = localStorage.getItem("player");
        if (savedName) {
            setPlayer(savedName);
        }
        setLoading(false);
        setShowBanner(true);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("player");
        setPlayer(null);
    };

    if (!player) return <Auth onAuth={handleAuth} />;
    else if (showBanner) return <Banner onClose={() => setShowBanner(false)} />;
    else
        return (
            <React.Suspense fallback={loading && <div> Loading... </div>}>
                <Content player={player} onLogout={handleLogout} />
            </React.Suspense>
        );
};

export default App;
