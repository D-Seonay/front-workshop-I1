# 🔌 Serveur Socket.IO - Chat Temps Réel

Serveur WebSocket complet avec Socket.IO pour la gestion de rooms, chat et synchronisation en temps réel.

## 🚀 Installation

```bash
cd server
npm install
```

## ⚙️ Configuration

Créez un fichier `.env` à partir de `.env.example`:

```bash
cp .env.example .env
```

Variables d'environnement:
- `PORT`: Port du serveur (défaut: 4000)
- `CLIENT_URL`: URL du client React (défaut: http://localhost:5173)
- `NODE_ENV`: Environnement (development/production)

## 🎯 Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm run build
npm start
```

## 📡 API REST

### `GET /health`
État du serveur et statistiques
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "stats": {
    "users": 5,
    "rooms": 2,
    "messages": 42
  }
}
```

### `GET /rooms`
Liste des rooms actives
```json
[
  {
    "id": "ABC123",
    "name": "Partie 1",
    "status": "waiting",
    "players": 2,
    "maxPlayers": 2,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## 🔌 Événements Socket.IO

### Client → Serveur

| Événement | Données | Description |
|-----------|---------|-------------|
| `user:register` | `{ username: string }` | Enregistrer un utilisateur |
| `room:create` | `{ name: string }` | Créer une room |
| `room:join` | `roomId: string` | Rejoindre une room |
| `room:leave` | - | Quitter la room actuelle |
| `room:start` | - | Démarrer la partie |
| `chat:send` | `content: string` | Envoyer un message |
| `player:set_ready` | `isReady: boolean` | Changer le statut ready |
| `player:set_role` | `role: 'agent' \| 'operator' \| null` | Choisir un rôle |

### Serveur → Client

| Événement | Données | Description |
|-----------|---------|-------------|
| `room:created` | `{ id, name }` | Room créée |
| `room:joined` | `{ roomId, users[] }` | Room rejointe |
| `room:user_joined` | `User` | Nouveau joueur dans la room |
| `room:user_left` | `{ userId, username }` | Joueur a quitté |
| `room:status_changed` | `'waiting' \| 'playing' \| 'finished'` | Statut de la room changé |
| `room:update` | `{ users[], status }` | Mise à jour de la room |
| `chat:message` | `ChatMessage` | Nouveau message |
| `chat:history` | `ChatMessage[]` | Historique des messages |
| `player:ready` | `{ userId, isReady }` | Statut ready changé |
| `player:role` | `{ userId, role }` | Rôle changé |
| `error` | `{ message, code? }` | Erreur |

## 📦 Structure du projet

```
server/
├── types/
│   └── socket.types.ts      # Types TypeScript
├── utils/
│   └── storage.ts           # Stockage en mémoire
├── handlers/
│   └── socketHandlers.ts    # Gestionnaires Socket.IO
├── server.ts                # Point d'entrée
├── package.json
└── tsconfig.json
```

## 🧪 Test avec un client simple

```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

// Enregistrement
socket.emit('user:register', { username: 'Alice' });

// Créer une room
socket.emit('room:create', { name: 'Ma partie' });

// Écouter les événements
socket.on('room:created', ({ id }) => {
  console.log('Room créée:', id);
});

socket.on('chat:message', (msg) => {
  console.log(`${msg.username}: ${msg.content}`);
});

// Envoyer un message
socket.emit('chat:send', 'Salut tout le monde! 👋');
```

## 🛡️ Gestion des erreurs

Le serveur renvoie des erreurs avec des codes:
- `NOT_REGISTERED`: Utilisateur non enregistré
- `ROOM_NOT_FOUND`: Room introuvable
- `ROOM_FULL`: Room complète
- `GAME_STARTED`: Partie déjà commencée
- `NOT_IN_ROOM`: Pas dans une room
- `NOT_ALL_READY`: Tous les joueurs ne sont pas prêts
- `ROLE_TAKEN`: Rôle déjà pris

## 📊 Logs

Le serveur affiche des logs détaillés:
- 🔌 Connexions/déconnexions
- 🏠 Création/suppression de rooms
- 👤 Enregistrement d'utilisateurs
- 💬 Messages envoyés
- ✅/❌ Changements de statut
- 🎭 Changements de rôle
- 📊 Statistiques

## 🚀 Déploiement

### Heroku
```bash
heroku create mon-app-socket
git push heroku main
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
```

### Railway / Render
1. Connectez votre repo GitHub
2. Configurez les variables d'environnement
3. Le serveur démarre automatiquement

## 📝 Notes

- Les données sont stockées en mémoire (redémarrage = perte des données)
- Pour la production, utilisez Redis ou une base de données
- Maximum 100 messages par room conservés en mémoire
- Les rooms vides sont automatiquement supprimées
