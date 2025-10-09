/**
 * Gestionnaires d'événements Socket.IO
 */

import { Socket } from 'socket.io';
import type { Room, Player } from '../types/socket.types';

const rooms: Record<string, Room> = {};

export const handleConnection = (socket: Socket) => {
  console.log(`[connection] Client connected: ${socket.id}`);

  // ===== CREATE ROOM =====
  socket.on('create_room', ({ name }: { name: string }) => {
    try {
      const roomId = Math.random().toString(36).substring(2, 7).toUpperCase();

      const player: Player = {
        id: socket.id,
        name,
        connected: true,
        isReady: false,
        joinedAt: Date.now(),
      };

      const newRoom: Room = {
        roomId,
        players: [player],
        status: 'lobby',
        createdAt: Date.now(),
      };

      rooms[roomId] = newRoom;
      socket.join(roomId);

      console.log(`[create_room] ${name} created room ${roomId}`);
      socket.emit('room_created', { code: roomId, room: newRoom });
    } catch (error) {
      console.error('❌ Error create_room:', error);
      socket.emit('error', { message: 'Error creating room' });
    }
  });

  // ===== JOIN ROOM =====
  socket.on('join_room', ({ code, name }: { code: string; name: string }) => {
    try {
      const room = rooms[code];
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      const alreadyJoined = room.players.find((p) => p.id === socket.id);
      if (alreadyJoined) {
        socket.emit('room_joined', { room });
        return;
      }

      const player: Player = {
        id: socket.id,
        name,
        connected: true,
        isReady: false,
        joinedAt: Date.now(),
      };

      room.players.push(player);
      socket.join(code);

      console.log(`[join_room] ${name} joined room ${code}`);

      socket.emit('room_joined', { room });
      socket.to(code).emit('room_update', { room });
      socket.to(code).emit('player_joined', { player });
    } catch (error) {
      console.error('❌ Error join_room:', error);
      socket.emit('error', { message: 'Error joining room' });
    }
  });

  // ===== TOGGLE READY =====
  socket.on('toggle_ready', ({ code }: { code: string }) => {
    try {
      const room = rooms[code];
      if (!room) return;

      const player = room.players.find((p) => p.id === socket.id);
      if (player) {
        player.isReady = !player.isReady;
        socket.to(code).emit('room_update', { room });
        socket.emit('room_update', { room });
      }

      const allReady = room.players.length > 0 && room.players.every((p) => p.isReady);
      if (allReady && room.status === 'lobby') {
        room.status = 'playing';
        socket.to(code).emit('game_started', { roomId: code });
        socket.emit('game_started', { roomId: code });
        console.log(`[game_started] All players ready in room ${code}`);
      }
    } catch (error) {
      console.error('❌ Error toggle_ready:', error);
    }
  });

  // ===== CHAT MESSAGE =====
  socket.on('send_message', ({ code, name, message }: { code: string; name: string; message: string }) => {
    try {
      const room = rooms[code];
      if (!room) return;

      const msg = {
        id: `${Date.now()}`,
        name,
        message,
        timestamp: new Date().toISOString(),
      };

      console.log(`[chat] ${name} in ${code}: ${message}`);
      socket.to(code).emit('message_received', msg);
      socket.emit('message_received', msg);
    } catch (error) {
      console.error('❌ Error send_message:', error);
    }
  });

  // ===== LEAVE ROOM =====
  socket.on('leave_room', ({ code }: { code: string }) => {
    try {
      const room = rooms[code];
      if (!room) return;

      const playerIndex = room.players.findIndex((p) => p.id === socket.id);
      if (playerIndex !== -1) {
        const [removedPlayer] = room.players.splice(playerIndex, 1);
        socket.leave(code);

        console.log(`[leave_room] ${removedPlayer.name} left ${code}`);
        socket.to(code).emit('player_left', { player: removedPlayer });
        socket.to(code).emit('room_update', { room });

        if (room.players.length === 0) {
          delete rooms[code];
          console.log(`[cleanup] Room ${code} deleted (empty)`);
        }
      }
    } catch (error) {
      console.error('❌ Error leave_room:', error);
    }
  });

  // ===== DISCONNECT =====
  socket.on('disconnect', () => {
    console.log(`[disconnect] ${socket.id} disconnected`);

    try {
      for (const [code, room] of Object.entries(rooms)) {
        const idx = room.players.findIndex((p) => p.id === socket.id);
        if (idx !== -1) {
          const [removed] = room.players.splice(idx, 1);
          socket.to(code).emit('room_update', { room });
          socket.to(code).emit('player_left', { player: removed });
          console.log(`[room_update] ${removed.name} left ${code}`);
        }

        if (room.players.length === 0) {
          delete rooms[code];
          console.log(`[cleanup] Room ${code} deleted (empty)`);
        }
      }
    } catch (error) {
      console.error('❌ Error disconnect:', error);
    }
  });
};
