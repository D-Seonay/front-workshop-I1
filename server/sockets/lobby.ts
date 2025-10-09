/**
 * Gestionnaire des événements Socket.io pour le lobby
 */

import { Socket } from 'socket.io';
import { roomStorage } from '../utils/roomStorage';
import { ClientToServerEvents, ServerToClientEvents } from '../types/room.types';

type LobbySocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export function handleLobbyConnection(socket: LobbySocket) {
    console.log(`🔌 Connexion: ${socket.id}`);

    // ===== CREATE ROOM =====
    socket.on('create_room', ({ name }) => {
        try {
            if (!name || name.trim().length === 0) {
                socket.emit('error', { message: 'Le nom est requis', code: 'NAME_REQUIRED' });
                return;
            }

            const room = roomStorage.createRoom(socket.id, name.trim());
            socket.join(room.code);

            socket.emit('room_created', { code: room.code, room });
            socket.emit('room_joined', { room });

            console.log(`✅ ${name} a créé la room ${room.code}`);
        } catch (error) {
            console.error('❌ Erreur create_room:', error);
            socket.emit('error', { message: 'Erreur lors de la création de la room' });
        }
    });

    // ===== JOIN ROOM =====
    socket.on('join_room', ({ name, code }) => {
        try {
            if (!name || name.trim().length === 0) {
                socket.emit('error', { message: 'Le nom est requis', code: 'NAME_REQUIRED' });
                return;
            }

            if (!code || code.trim().length === 0) {
                socket.emit('error', { message: 'Le code de room est requis', code: 'CODE_REQUIRED' });
                return;
            }

            const upperCode = code.toUpperCase().trim();
            const room = roomStorage.getRoom(upperCode);

            if (!room) {
                socket.emit('error', { message: 'Room introuvable', code: 'ROOM_NOT_FOUND' });
                return;
            }

            if (room.status !== 'waiting') {
                socket.emit('error', { message: 'La partie a déjà commencé', code: 'GAME_STARTED' });
                return;
            }

            if (room.players.length >= 2) {
                socket.emit('error', { message: 'La room est complète (max 2 joueurs)', code: 'ROOM_FULL' });
                return;
            }

            const updatedRoom = roomStorage.addPlayerToRoom(upperCode, socket.id, name.trim());
            if (!updatedRoom) {
                socket.emit('error', { message: 'Erreur lors de la connexion à la room' });
                return;
            }

            socket.join(upperCode);
            socket.emit('room_joined', { room: updatedRoom });
            socket.to(upperCode).emit('room_update', { room: updatedRoom });

            console.log(`✅ ${name} a rejoint ${upperCode}`);
        } catch (error) {
            console.error('❌ Erreur join_room:', error);
            socket.emit('error', { message: 'Erreur lors de la connexion à la room' });
        }
    });

    // ===== LEAVE ROOM =====
    socket.on('leave_room', ({ code }) => {
        try {
            handlePlayerLeave(socket, code);
        } catch (error) {
            console.error('❌ Erreur leave_room:', error);
        }
    });

    // ===== SEND MESSAGE =====
    socket.on('send_message', ({ code, message, name }) => {
        try {
            if (!message || message.trim().length === 0) return;

            const room = roomStorage.getRoom(code);
            if (!room) {
                socket.emit('error', { message: 'Room introuvable', code: 'ROOM_NOT_FOUND' });
                return;
            }

            const chatMessage = {
                name: name.trim(),
                message: message.trim(),
                timestamp: new Date().toISOString(),
            };

            // Diffuser à tous les joueurs de la room (incluant l'émetteur)
            socket.to(code).emit('message_received', chatMessage);
            socket.emit('message_received', chatMessage);

            console.log(`💬 [${code}] ${name}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`);
        } catch (error) {
            console.error('❌ Erreur send_message:', error);
        }
    });

    // ===== TOGGLE READY =====
    socket.on('toggle_ready', ({ code }) => {
        try {
            const room = roomStorage.togglePlayerReady(socket.id);
            if (!room) {
                socket.emit('error', { message: 'Impossible de modifier le statut', code: 'UPDATE_FAILED' });
                return;
            }

            socket.to(code).emit('room_update', { room });
            socket.emit('room_update', { room });
        } catch (error) {
            console.error('❌ Erreur toggle_ready:', error);
        }
    });

    // ===== SET ROLE =====
    socket.on('set_role', ({ code, role }) => {
        try {
            const room = roomStorage.setPlayerRole(socket.id, role);
            if (!room) {
                socket.emit('error', { message: 'Ce rôle est déjà pris ou erreur', code: 'ROLE_TAKEN' });
                return;
            }

            socket.to(code).emit('room_update', { room });
            socket.emit('room_update', { room });
        } catch (error) {
            console.error('❌ Erreur set_role:', error);
        }
    });

    // ===== UPDATE STEP =====
    socket.on('update_step', ({ code, step }) => {
        try {
            const room = roomStorage.getRoom(code);
            console.log(`🔄 Requête update_step reçue pour ${code}: step = ${step}`);
            if (!room) {
                socket.emit('error', { message: 'Room introuvable', code: 'ROOM_NOT_FOUND' });
                return;
            }

            // Mettre à jour la progression dans la room
            room.currentStep = step;
            console.log(`🔄 Room ${code} step mise à jour en mémoire: ${room.currentStep}`);

            // Diffuser à tous les joueurs de la room
            socket.to(code).emit('step_updated', { step });
            socket.emit('step_updated', { step }); // aussi à l’émetteur pour cohérence
            console.log(`🔄 Événement step_updated émis dans ${code}: step = ${step}`);

            console.log(`🔄 Room ${code} mise à jour: step = ${step}`);
        } catch (error) {
            console.error('❌ Erreur update_step:', error);
            socket.emit('error', { message: 'Impossible de mettre à jour la progression' });
        }
    });


    

    // ===== START GAME =====
    socket.on('start_game', ({ code }) => {
        try {
            const room = roomStorage.startGame(code, socket.id);

            if (!room) {
                socket.emit('error', {
                    message: 'Impossible de démarrer (tous les joueurs doivent être prêts, min 2 joueurs)',
                    code: 'START_FAILED'
                });
                return;
            }

            socket.to(code).emit('game_started', { room });
            socket.emit('game_started', { room });

            console.log(`🎮 Partie démarrée dans ${code}`);
        } catch (error) {
            console.error('❌ Erreur start_game:', error);
        }
    });

    // ===== DISCONNECTION =====
    socket.on('disconnect', () => {
        try {
            const roomCode = roomStorage.getRoomCodeForPlayer(socket.id);
            if (roomCode) {
                handlePlayerLeave(socket, roomCode);
            }
            console.log(`🔌 Déconnexion: ${socket.id}`);
        } catch (error) {
            console.error('❌ Erreur disconnect:', error);
        }
    });
}

// Helper: gérer le départ d'un joueur
function handlePlayerLeave(socket: LobbySocket, code: string) {
    const result = roomStorage.removePlayerFromRoom(socket.id);

    if (result.roomCode && result.room) {
        const player = result.room.players.find(p => p.id === socket.id);
        const playerName = player?.name || 'Joueur inconnu';

        socket.leave(code);
        socket.to(code).emit('player_left', { playerId: socket.id, playerName });
        socket.to(code).emit('room_update', { room: result.room });

        console.log(`👋 ${playerName} a quitté ${code}`);
    }
}
