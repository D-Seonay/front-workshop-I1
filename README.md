# 🎨 Voyage dans les Musées Perdus  
> 🏆 Projet Workshop M1 EPSI/WIS 2025 – Thème : *Arts créatifs & Tourisme*  
---

## 🧩 Contexte du projet
Dans le cadre du Workshop **"Escape Tech – Crée ton aventure numérique"**, notre équipe a conçu un **Escape Game coopératif et éducatif** :  
**Voyage dans les Musées Perdus** 🎭  

Une cyberattaque mondiale a effacé les œuvres d’art de plusieurs musées.  
Deux agents, un **Opérateur** et un **Agent de terrain**, doivent collaborer à distance pour **restaurer les musées de Paris, New York et Tokyo** avant que le patrimoine mondial ne disparaisse à jamais.  

Chaque ville propose des **énigmes interactives**, mêlant **logique, communication et apprentissage artistique**.

---

## 🎯 Objectifs pédagogiques
- Sensibiliser à la **préservation du patrimoine culturel mondial**  
- Découvrir les bases du **codage binaire, RGB, logique et observation visuelle**  
- Promouvoir la **coopération et la communication à distance**  
- Offrir une expérience **ludo-éducative** moderne, accessible et intuitive  

---

## 🗺️ Scénario global

### 🗼 **Paris – Le Louvre numérique**
> Thème : Art classique, logique et observation  
- 🔹 Enigme 1 : Conversion binaire → décimale  
- 🔹 Enigme 2 : Labyrinthe “Pacman” (guidage vocal)  
- 🔹 Enigme 3 : 7 différences entre deux tableaux  
🎯 Code final : **LISA**

---

### 🗽 **New York – MoMA interactif**
> Thème : Art moderne et logique informatique  
- 🔹 Enigme 1 : Terminal de sécurité (modification de fichier)  
- 🔹 Enigme 2 : Compter les formes pour trouver un code  
- 🔹 Enigme 3 : Remettre les tableaux dans le bon ordre  
🎯 Code final : **ARTS**

---

### 🏮 **Tokyo – Digital Art Museum**
> Thème : Art numérique, lumière et synchronisation  
- 🔹 Enigme 1 : Fusion RGB (codage des couleurs)  
- 🔹 Enigme 2 : Transmission binaire (encoder / décoder un mot)  
- 🔹 Enigme 3 : Séquence lumineuse (Simon Game)  
🎯 Code final : **UNITY**

---

### 🎉 **Fin du jeu**
Une fois les trois musées restaurés, les joueurs débloquent la phrase finale :  
> **“Quand l’art unit le monde, il renaît.”** 🌍  

---

## ⚙️ Fonctionnalités principales

| Fonction | Description |
|-----------|-------------|
| 🧠 **3 salles interactives** | Paris, New York, Tokyo |
| 🎮 **Mode coopératif** | Deux joueurs (Agent / Opérateur) connectés via Socket.io |
| 💬 **Chat temps réel** | Communication intégrée pendant les énigmes |
| ⏱️ **Timer global** | Compte à rebours commun |
| 📊 **Progression sauvegardée** | Avancement entre les villes |
| 🔐 **Système de codes** | Chaque ville débloque un mot-clé |
| 🖥️ **Interface réactive** | Navigation fluide, design clair et immersif |

---

## 🧱 Architecture technique

### 🖥️ **Frontend**
- **React + Vite** → interface rapide et modulaire  
- **React Router DOM** → gestion des pages (Home, Paris, New York, Tokyo, etc.)  
- **TailwindCSS** → design harmonieux et rapide à styliser  
- **Framer Motion** → transitions animées  
- **Socket.io-client** → synchronisation en temps réel entre joueurs  

### 🌐 **Backend / Réseau**
- **Node.js + Express** (ou Firebase Realtime DB)
- **Socket.io** pour la communication multi-joueur  
- **HTTPS sécurisé** pour les échanges  
- Hébergement sur **Render** (backend) et **Vercel** (frontend)  

---

## 🧩 Structure du projet

```

/src
├── assets/                # Images, icônes, sons
├── components/            # Composants réutilisables
├── pages/                 # Pages principales (Home, Lobby, Paris, etc.)
├── context/               # Contexts React (GameContext, SocketContext)
├── data/                  # Données JSON des énigmes
├── App.jsx                # Router principal
├── main.jsx               # Point d'entrée
└── index.css              # Style global

````

## 🧑‍💻 Installation et lancement

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/D-Seonay/front-workshop-I1.git
cd front-workshop-I1
```

### 2️⃣ Installer les dépendances

```bash
npm install
```

### 3️⃣ Lancer le serveur local

```bash
npm run dev
```

Le projet sera accessible sur [http://localhost:8080](http://localhost:8080)

---

## 🎨 Charte graphique

* **Thème visuel :** voyage artistique et technologique
* **Couleurs principales :** bleu nuit `#1A1B2F`, doré `#E6B800`, blanc cassé `#F2F2F2`
* **Typographie :** Poppins (UI) & Playfair Display (titres)
* **Ambiance :** musées modernes, carte du monde, effets de lumière

---

## 🧾 Livrables Workshop

* ✅ **Escape Game jouable** (3 salles)
* ✅ **Rapport technique PDF** (architecture, algorithmes, captures)
* ✅ **Poster scientifique A3**
* ✅ **Support de présentation PPTX**
* ✅ **Code source sur GitHub**

---

## 🏁 Fin du jeu

> *"Les musées du monde sont rallumés, les couleurs reprennent vie,
> et la mémoire du monde renaît entre vos mains."*

**Code final : UNITY** 🕊️