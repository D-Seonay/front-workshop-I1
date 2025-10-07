import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

const GameWatcher = () => {
    const { missionFailed } = useGame();
    const navigate = useNavigate();

    useEffect(() => {
        if (missionFailed) {
            navigate("/credits?status=failure");
        }
    }, [missionFailed, navigate]);

    return null; // pas besoin de rendre quoi que ce soit
};

export default GameWatcher;
