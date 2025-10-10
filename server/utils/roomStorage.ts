/**
 * Stockage en mémoire des rooms
 */

import { Room, Player } from '../types/room.types';
import { generateRoomCode } from './generateCode';
import {list} from "postcss";

class RoomStorage {
    private rooms: Map<string, Room> = new Map();
    private playerToRoom: Map<string, string> = new Map(); // socketId → roomCode

    /**
     * Crée une nouvelle room
     */
    createRoom(hostId: string, hostName: string): Room {
        let code: string;

        do {
            code = generateRoomCode();
        } while (this.rooms.has(code));

        const host: Player = {
            id: hostId,
            name: hostName,
            role: null,
            isReady: false,
            joinedAt: new Date().toISOString(),
        };

        const room: Room = {
            code,
            players: [host],
            status: 'waiting',
            currentMission: 1,
            completedCities: new Set<string>(),
            createdAt: new Date().toISOString(),
            hostId,
        };

        this.rooms.set(code, room);
        this.playerToRoom.set(hostId, code);

        console.log(`🏠 Room créée: ${code} par ${hostName}`);
        return room;
    }


    /**
     * Récupère une room par son code
     */
    getRoom(code: string): Room | null {
        return this.rooms.get(code) || null;
    }

    /**
     * Ajoute un joueur à une room
     */
    addPlayerToRoom(code: string, playerId: string, playerName: string): Room | null {
        const room = this.rooms.get(code);
        if (!room) return null;

        // Vérifier si le joueur est déjà dans la room
        if (room.players.some(p => p.id === playerId)) {
            return room;
        }

        const player: Player = {
            id: playerId,
            name: playerName,
            role: null,
            isReady: false,
            joinedAt: new Date().toISOString(),
        };

        room.players.push(player);
        this.playerToRoom.set(playerId, code);

        console.log(`👤 ${playerName} a rejoint ${code}`);
        return room;
    }

    /**
     * Retire un joueur d'une room
     */
    removePlayerFromRoom(playerId: string): { room: Room | null; wasHost: boolean; roomCode: string | null } {
        const roomCode = this.playerToRoom.get(playerId);
        if (!roomCode) return { room: null, wasHost: false, roomCode: null };

        const room = this.rooms.get(roomCode);
        if (!room) return { room: null, wasHost: false, roomCode };

        const wasHost = room.hostId === playerId;
        room.players = room.players.filter(p => p.id !== playerId);
        this.playerToRoom.delete(playerId);

        // Si la room est vide, la supprimer
        if (room.players.length === 0) {
            this.rooms.delete(roomCode);
            console.log(`🗑️  Room ${roomCode} supprimée (vide)`);
            return { room: null, wasHost, roomCode };
        }

        // Si c'était l'hôte, transférer à un autre joueur
        if (wasHost && room.players.length > 0) {
            room.hostId = room.players[0].id;
            console.log(`👑 Nouvel hôte: ${room.players[0].name}`);
        }

        console.log(`👋 Joueur retiré de ${roomCode}`);
        return { room, wasHost, roomCode };
    }

    /**
     * Met à jour le statut ready d'un joueur
     */
    togglePlayerReady(playerId: string): Room | null {
        const roomCode = this.playerToRoom.get(playerId);
        if (!roomCode) return null;

        const room = this.rooms.get(roomCode);
        if (!room) return null;

        const player = room.players.find(p => p.id === playerId);
        if (!player) return null;

        player.isReady = !player.isReady;
        console.log(`${player.isReady ? '✅' : '❌'} ${player.name} ready: ${player.isReady}`);

        return room;
    }

    /**
     * Met à jour le rôle d'un joueur
     */
    setPlayerRole(playerId: string, role: Player['role']): Room | null {
        const roomCode = this.playerToRoom.get(playerId);
        if (!roomCode) return null;

        const room = this.rooms.get(roomCode);
        if (!room) return null;

        const player = room.players.find(p => p.id === playerId);
        if (!player) return null;

        // Vérifier si le rôle est déjà pris
        if (role !== null) {
            const roleTaken = room.players.some(p => p.id !== playerId && p.role === role);
            if (roleTaken) return null;
        }

        player.role = role;
        console.log(`🎭 ${player.name} -> rôle: ${role}`);

        return room;
    }

    /**
     * Démarre la partie
     */
    startGame(code: string, hostId: string): Room | null {
        const room = this.rooms.get(code);
        if (!room) return null;

        // Vérifier que c'est l'hôte qui démarre
        if (room.hostId !== hostId) return null;

        // Vérifier que tous les joueurs sont prêts
        const allReady = room.players.every(p => p.isReady);
        if (!allReady) return null;

        // Vérifier qu'il y a au moins 2 joueurs
        if (room.players.length < 2) return null;

        room.status = 'playing';
        console.log(`🎮 Partie démarrée dans ${code}`);

        return room;
    }

    /**
     * Récupère le code de la room d'un joueur
     */
    getRoomCodeForPlayer(playerId: string): string | null {
        return this.playerToRoom.get(playerId) || null;
    }

    /**
     * Statistiques
     */
    getStats() {
        return {
            rooms: this.rooms.size,
            players: this.playerToRoom.size,
        };
    }

    /**
     * Liste toutes les rooms
     */
    getAllRooms(): Room[] {
        return Array.from(this.rooms.values());
    }

    updateMission(code: string, mission: number) {
        const room = this.rooms.get(code);
        if (!room) return null;
        room.currentMission = mission;
        return room;
    }

    updateCompletedCities(code: string, city: string) {
        const room = this.rooms.get(code);
        if (!room) return null;
        room.completedCities.add(city);
        return room;
    }

    // Exemple : calcul simple dans RoomStorage ou dans game socket
    getProgress(room: Room): number {
        return room.currentMission;
    }


}

export const roomStorage = new RoomStorage();
