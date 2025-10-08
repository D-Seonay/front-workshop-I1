# 🚀 Guide de déploiement du serveur Socket.IO

## ⚠️ Important

Le serveur Socket.IO ne peut **PAS** être exécuté directement dans Lovable. Vous devez le déployer sur un service externe.

## 📦 Structure du projet

```
project/
├── server/              ← Serveur Socket.IO (à déployer séparément)
│   ├── types/
│   ├── utils/
│   ├── handlers/
│   ├── server.ts
│   └── package.json
├── src/                 ← Client React (dans Lovable)
│   ├── services/
│   │   └── socketService.ts
│   └── components/
│       └── ChatBox.tsx
```

## 🎯 Étapes de déploiement

### 1. Copier le dossier `server/` vers votre machine locale

```bash
# Téléchargez tout le contenu du dossier server/ depuis Lovable
```

### 2. Installer les dépendances

```bash
cd server
npm install
```

### 3. Tester localement

```bash
# Créer un fichier .env
echo "PORT=4000" > .env
echo "CLIENT_URL=http://localhost:5173" >> .env

# Démarrer le serveur
npm run dev
```

Le serveur démarre sur `http://localhost:4000`

### 4. Déployer sur un service cloud

#### Option A: Railway (Recommandé ⭐)

1. Créez un compte sur [Railway.app](https://railway.app)
2. Installez Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```
3. Connectez-vous:
   ```bash
   railway login
   ```
4. Dans le dossier `server/`:
   ```bash
   railway init
   railway up
   ```
5. Notez l'URL publique (ex: `https://your-app.railway.app`)

#### Option B: Render

1. Créez un compte sur [Render.com](https://render.com)
2. Créez un nouveau "Web Service"
3. Connectez votre repo GitHub (si vous avez push le code)
4. Configuration:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Ajoutez `CLIENT_URL` avec votre URL Lovable

#### Option C: Heroku

```bash
cd server
heroku login
heroku create mon-app-socket
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

#### Option D: Fly.io

```bash
cd server
fly launch
fly deploy
```

### 5. Configurer le client React dans Lovable

Une fois le serveur déployé, mettez à jour l'URL dans votre code:

**Dans `src/services/socketService.ts`:**

```typescript
// Remplacez 'http://localhost:4000' par votre URL de production
const SOCKET_URL = 'https://your-app.railway.app'; // ← Votre URL

connect(serverUrl: string = SOCKET_URL): SocketClient {
  // ...
}
```

Ou mieux, utilisez une variable d'environnement:

```typescript
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
```

Et dans Lovable, ajoutez la variable d'environnement dans les settings:
```
VITE_SOCKET_URL=https://your-app.railway.app
```

### 6. Activer CORS sur le serveur

Assurez-vous que le serveur autorise l'origine de votre app Lovable:

**Dans `server/server.ts`:**

```typescript
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://your-lovable-app.lovable.app' // ← Ajoutez votre URL Lovable
    ],
    credentials: true,
  },
});
```

## 🧪 Tester la connexion

1. Démarrez votre app Lovable
2. Ouvrez la console du navigateur
3. Vous devriez voir:
   ```
   🔌 Connexion à https://your-app.railway.app...
   ✅ Socket connecté: xyz123
   ```

## 📊 Monitoring

Pour Railway, Render, et Heroku, vous pouvez voir les logs en temps réel:

```bash
# Railway
railway logs

# Render
# Via le dashboard web

# Heroku
heroku logs --tail
```

## 🔧 Dépannage

### Erreur CORS
- Vérifiez que l'URL de votre app Lovable est dans la config CORS du serveur
- Vérifiez les logs du serveur pour voir l'origine des requêtes

### Connexion refusée
- Vérifiez que le serveur est bien démarré
- Testez l'endpoint `/health`: `https://your-app.railway.app/health`
- Vérifiez que le port est ouvert (4000 par défaut)

### Socket se déconnecte
- Vérifiez les logs du serveur
- Assurez-vous que le serveur supporte les WebSockets
- Certains proxies bloquent les WebSockets, essayez avec `polling` d'abord

## 💰 Coûts estimés

| Service | Prix | Gratuit |
|---------|------|---------|
| Railway | ~$5/mois | 500h/mois gratuit |
| Render | $7/mois | Plan gratuit avec limitations |
| Heroku | $7/mois | Plus de plan gratuit |
| Fly.io | ~$5/mois | 3 VM gratuites |

## 📚 Ressources

- [Documentation Socket.IO](https://socket.io/docs/v4/)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Server README complet](./server/README.md)

## ✅ Checklist

- [ ] Serveur déployé et accessible
- [ ] URL du serveur configurée dans le client
- [ ] CORS configuré correctement
- [ ] Variables d'environnement définies
- [ ] Test de connexion réussi
- [ ] Chat fonctionne en temps réel
- [ ] Monitoring actif
