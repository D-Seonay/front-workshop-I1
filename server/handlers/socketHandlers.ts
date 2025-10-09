/**
 * Gestionnaires d'événements Socket.IO
 */

import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../utils/storage';
import { ChatMessage, PlayerRole } from '../types/socket.types';

export const handleConnection = (socket: Socket) => {
  console.log(`🔌 Nouvelle connexion: ${socket.id}`);

  // ===== USER REGISTRATION =====
  socket.on('user:register', ({ username }: { username: string }) => {
    try {
      // Créer l'utilisateur
      const user = storage.createUser(socket.id, username);
      socket.data.userId = user.id;
      socket.data.username = username;

      console.log(`✅ User enregistré: ${username} (${socket.id})`);
    } catch (error) {
      console.error('❌ Erreur user:register:', error);
      socket.emit('error', { message: 'Erreur lors de l\'enregistrement' });
    }
  });

  // ===== ROOM CREATION =====
  socket.on('room:create', ({ name }: { name: string }) => {
    try {
      if (!socket.data.username) {
        socket.emit('error', { message: 'Vous devez vous enregistrer d\'abord', code: 'NOT_REGISTERED' });
        return;
      }

      // Générer un ID court pour la room
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      const room = storage.createRoom(roomId, name);

      // Ajouter l'utilisateur à la room
      storage.addUserToRoom(socket.id, roomId);
      socket.join(roomId);

      socket.emit('room:created', { id: room.id, name: room.name });
      socket.emit('room:joined', {
        roomId: room.id,
        users: storage.getRoomUsers(roomId)
      });

      console.log(`🏠 ${socket.data.username} a créé la room ${roomId}`);
    } catch (error) {
      console.error('❌ Erreur room:create:', error);
      socket.emit('error', { message: 'Erreur lors de la création de la room' });
    }
  });

  // ===== ROOM JOIN =====
  socket.on('room:join', (roomId: string) => {
    try {
      if (!socket.data.username) {
        socket.emit('error', { message: 'Vous devez vous enregistrer d\'abord', code: 'NOT_REGISTERED' });
        return;
      }

      const room = storage.getRoom(roomId);
      if (!room) {
        socket.emit('error', { message: 'Room introuvable', code: 'ROOM_NOT_FOUND' });
        return;
      }

      if (room.users.size >= room.maxPlayers) {
        socket.emit('error', { message: 'Room complète', code: 'ROOM_FULL' });
        return;
      }

      if (room.status !== 'waiting') {
        socket.emit('error', { message: 'La partie a déjà commencé', code: 'GAME_STARTED' });
        return;
      }

      // Ajouter l'utilisateur à la room
      const success = storage.addUserToRoom(socket.id, roomId);
      if (!success) {
        socket.emit('error', { message: 'Impossible de rejoindre la room' });
        return;
      }

      socket.join(roomId);

      const user = storage.getUser(socket.id)!;
      const users = storage.getRoomUsers(roomId);

      // Envoyer l'historique des messages au nouveau joueur
      const messages = storage.getRoomMessages(roomId);
      socket.emit('chat:history', messages);

      // Notifier tout le monde
      socket.emit('room:joined', { roomId, users });
      socket.to(roomId).emit('room:user_joined', user);
      socket.to(roomId).emit('room:update', { users, status: room.status });

      console.log(`👋 ${socket.data.username} a rejoint la room ${roomId}`);
    } catch (error) {
      console.error('❌ Erreur room:join:', error);
      socket.emit('error', { message: 'Erreur lors de la connexion à la room' });
    }
  });

  // ===== ROOM LEAVE =====
  socket.on('room:leave', () => {
    handleLeaveRoom(socket);
  });

  // ===== ROOM START =====
  socket.on('room:start', () => {
    try {
      const user = storage.getUser(socket.id);
      if (!user || !user.roomId) {
        socket.emit('error', { message: 'Vous n\'êtes pas dans une room', code: 'NOT_IN_ROOM' });
        return;
      }

      const room = storage.getRoom(user.roomId);
      if (!room) return;

      const users = storage.getRoomUsers(user.roomId);

      // Vérifier que tous les joueurs sont prêts
      const allReady = users.every(u => u.isReady);
      if (!allReady) {
        socket.emit('error', { message: 'Tous les joueurs doivent être prêts', code: 'NOT_ALL_READY' });
        return;
      }

      // Vérifier qu'il y a assez de joueurs
      if (users.length < 2) {
        socket.emit('error', { message: 'Il faut au moins 2 joueurs', code: 'NOT_ENOUGH_PLAYERS' });
        return;
      }

      // Démarrer la partie
      storage.updateRoomStatus(user.roomId, 'playing');
      socket.to(user.roomId).emit('room:status_changed', 'playing');
      socket.emit('room:status_changed', 'playing');

      console.log(`🎮 Partie démarrée dans la room ${user.roomId}`);
    } catch (error) {
      console.error('❌ Erreur room:start:', error);
      socket.emit('error', { message: 'Erreur lors du démarrage de la partie' });
    }
  });

  // ===== CHAT MESSAGE =====
  socket.on('chat:send', (content: string) => {
    try {
      const user = storage.getUser(socket.id);
      if (!user || !user.roomId) {
        socket.emit('error', { message: 'Vous devez être dans une room pour envoyer des messages', code: 'NOT_IN_ROOM' });
        return;
      }

      if (!content.trim()) {
        return;
      }

      const message: ChatMessage = {
        id: uuidv4(),
        roomId: user.roomId,
        userId: user.id,
        username: user.username,
        content: content.trim(),
        timestamp: new Date(),
      };

      storage.addMessage(message);

      // Envoyer à tous les membres de la room (incluant l'émetteur)
      socket.to(user.roomId).emit('chat:message', message);
      socket.emit('chat:message', message);

      console.log(`💬 ${user.username}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`);
    } catch (error) {
      console.error('❌ Erreur chat:send:', error);
      socket.emit('error', { message: 'Erreur lors de l\'envoi du message' });
    }
  });

  // ===== PLAYER READY =====
  socket.on('player:set_ready', (isReady: boolean) => {
    try {
      const user = storage.getUser(socket.id);
      if (!user || !user.roomId) {
        socket.emit('error', { message: 'Vous n\'êtes pas dans une room', code: 'NOT_IN_ROOM' });
        return;
      }

      storage.updateUserReady(socket.id, isReady);

      const users = storage.getRoomUsers(user.roomId);
      const room = storage.getRoom(user.roomId);

      socket.to(user.roomId).emit('player:ready', { userId: socket.id, isReady });
      socket.to(user.roomId).emit('room:update', { users, status: room!.status });

      console.log(`${isReady ? '✅' : '❌'} ${user.username} -> ready: ${isReady}`);
    } catch (error) {
      console.error('❌ Erreur player:set_ready:', error);
      socket.emit('error', { message: 'Erreur lors de la mise à jour du statut' });
    }
  });

  // ===== PLAYER ROLE =====
  socket.on('player:set_role', (role: PlayerRole) => {
    try {
      const user = storage.getUser(socket.id);
      if (!user || !user.roomId) {
        socket.emit('error', { message: 'Vous n\'êtes pas dans une room', code: 'NOT_IN_ROOM' });
        return;
      }

      // Vérifier si le rôle est déjà pris
      const users = storage.getRoomUsers(user.roomId);
      const roleTaken = users.some(u => u.id !== socket.id && u.role === role);

      if (roleTaken && role !== null) {
        socket.emit('error', { message: 'Ce rôle est déjà pris', code: 'ROLE_TAKEN' });
        return;
      }

      storage.updateUserRole(socket.id, role);

      const updatedUsers = storage.getRoomUsers(user.roomId);
      const room = storage.getRoom(user.roomId);

      socket.to(user.roomId).emit('player:role', { userId: socket.id, role });
      socket.to(user.roomId).emit('room:update', { users: updatedUsers, status: room!.status });

      console.log(`🎭 ${user.username} -> role: ${role}`);
    } catch (error) {
      console.error('❌ Erreur player:set_role:', error);
      socket.emit('error', { message: 'Erreur lors de la mise à jour du rôle' });
    }
  });

  // ===== DISCONNECTION =====
  socket.on('disconnect', () => {
    handleDisconnect(socket);
  });
};

// ===== HELPER FUNCTIONS =====

function handleLeaveRoom(socket: Socket) {
  try {
    const user = storage.getUser(socket.id);
    if (!user || !user.roomId) return;

    const roomId = user.roomId;
    const room = storage.getRoom(roomId);

    socket.leave(roomId);
    storage.removeUserFromRoom(socket.id);

    if (room) {
      const users = storage.getRoomUsers(roomId);
      socket.to(roomId).emit('room:user_left', {
        userId: socket.id,
        username: user.username
      });
      socket.to(roomId).emit('room:update', { users, status: room.status });
    }

    console.log(`👋 ${user.username} a quitté la room ${roomId}`);
  } catch (error) {
    console.error('❌ Erreur handleLeaveRoom:', error);
  }
}

function handleDisconnect(socket: Socket) {
  try {
    const user = storage.getUser(socket.id);
    if (!user) {
      console.log(`🔌 Déconnexion: ${socket.id}`);
      return;
    }

    console.log(`🔌 Déconnexion: ${user.username} (${socket.id})`);

    // Quitter la room si l'utilisateur y était
    if (user.roomId) {
      handleLeaveRoom(socket);
    }

    // Supprimer l'utilisateur
    storage.deleteUser(socket.id);

    // Afficher les stats
    const stats = storage.getStats();
    console.log(`📊 Stats: ${stats.users} users, ${stats.rooms} rooms, ${stats.messages} messages`);
  } catch (error) {
    console.error('❌ Erreur handleDisconnect:', error);
  }
}
