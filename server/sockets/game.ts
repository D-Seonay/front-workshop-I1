import { Socket, Server } from "socket.io";
import { roomStorage } from "../utils/roomStorage";

export function handleGameConnection(io: Server, socket: Socket) {
    console.log(`🎮 [Game] Client connecté: ${socket.id}`);

    // Quand une mission est terminée (énigme 1 → 2 → 3)
    socket.on("mission_update", ({ roomCode, mission }: { roomCode: string; mission: number }) => {
        const room = roomStorage.updateMission(roomCode, mission);
        if (room) {
            io.to(roomCode).emit("room:update", room);
            console.log(`🚀 [Game] Mission ${mission} dans ${roomCode}`);
        }
    });

    // Quand les différences progressent dans le mini-jeu
    socket.on("completedCities_update", ({ roomCode, cities }: { roomCode: string; cities: string }) => {
        const room = roomStorage.updateCompletedCities(roomCode, cities);
        if (room) {
            io.to(roomCode).emit("room:update", room);
            console.log(`🏁 [Game] Villes complétées dans ${roomCode}`);
        }
    });

    socket.on("disconnect", () => {
        console.log(`❌ [Game] Déconnexion: ${socket.id}`);
    });
}
