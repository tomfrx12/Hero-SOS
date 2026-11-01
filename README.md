# Front-end Hero SOS

Ce projet est l'interface web du projet Hero SOS, développée avec React et TypeScript. Elle permet aux citoyens de signaler des incidents, aux super-héros de suivre leurs interventions et de partager leurs films préférés, à tous de lire le blog et de parcourir la vidéothèque, et aux administrateurs de gérer la plateforme (incidents, utilisateurs, avis, articles, films, newsletter). Toutes les données proviennent de l'[API Hero SOS](https://github.com/tomfrx12/Hero-SOS-API) (projet back-end séparé).

## Liens

| Projet    | Dépôt GitHub                                                      | En ligne                                                                        |
| --------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Front-end | [tomfrx12/Hero-SOS](https://github.com/tomfrx12/Hero-SOS)         | [heros-sos.tom-fourneaux.fr](https://heros-sos.tom-fourneaux.fr/)               |
| Back-end  | [tomfrx12/Hero-SOS-API](https://github.com/tomfrx12/Hero-SOS-API) | [api.heros-sos.tom-fourneaux.fr](https://api.heros-sos.tom-fourneaux.fr/health) |

## Sommaire

1. [Technologies utilisées](#technologies-utilisées)
2. [Installation et lancement](#installation-et-lancement)
   - [Prérequis](#prérequis)
   - [Installation](#installation)
   - [Configuration](#configuration)
   - [Démarrage du projet](#démarrage-du-projet)
   - [Build pour la production](#build-pour-la-production)
   - [Déploiement avec Docker](#déploiement-avec-docker)
3. [Scripts disponibles](#scripts-disponibles)
4. [Structure du projet](#structure-du-projet)
5. [Pages](#pages)
6. [Rôles et accès](#rôles-et-accès)
7. [Auteurs](#auteurs)
8. [Licence](#licence)

## Technologies utilisées

- **[React 19](https://react.dev/)** : bibliothèque pour construire l'interface utilisateur
- **[TypeScript](https://www.typescriptlang.org/)** : typage du code
- **[Vite](https://vite.dev/)** : serveur de développement et outil de build
- **[React Router](https://reactrouter.com/)** : gestion des routes et des pages protégées
- **[Tailwind CSS 4](https://tailwindcss.com/)** : styles
- **[React Leaflet](https://react-leaflet.js.org/)** : carte interactive (localisation des incidents)
- **[Lenis](https://lenis.darkroom.engineering/)** : défilement fluide
- **[Lucide React](https://lucide.dev/)** : icônes
- **[TinyMCE](https://www.tiny.cloud/)** : éditeur de texte riche pour écrire les articles du blog (copié dans le build par `vite-plugin-static-copy`, aucune clé d'API nécessaire)
- **Docker + Nginx** : déploiement de la version de production

## Installation et lancement

### Prérequis

- [Node.js](https://nodejs.org/)
- npm
- L'[API Hero SOS](https://github.com/tomfrx12/Hero-SOS-API) lancée et accessible (voir son README)
- Docker (optionnel, uniquement pour le déploiement)

### Installation

Cloner le repository et installer les dépendances :

```sh
git clone https://github.com/tomfrx12/Hero-SOS.git
cd Hero-SOS
npm install
```

### Configuration

Copier le fichier d'exemple des variables d'environnement :

```sh
cp .env.example .env
```

Puis renseigner l'URL de l'API dans le fichier `.env` :

```env
VITE_API_URL="http://localhost:3000"
```

> L'API n'accepte (CORS) que les requêtes venant de l'URL définie dans sa variable `FRONTEND_URL`. L'API en ligne n'autorise que `https://heros-sos.tom-fourneaux.fr` : en développement, il faut donc lancer l'API en local avec `FRONTEND_URL="http://localhost:5173"`.

| Variable       | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `VITE_API_URL` | URL de base de l'API Hero SOS, sans `/` final (adapter le port à celui de l'API) |

> La variable est intégrée au code au moment du build par Vite : après une modification, il faut relancer `npm run dev` ou refaire un `npm run build`.

### Démarrage du projet

En mode développement :

```sh
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173) dans un navigateur.

### Build pour la production

```sh
npm run build
```

Cette commande vérifie les types TypeScript puis génère les fichiers optimisés dans le dossier `dist/`. Pour les tester en local :

```sh
npm run preview
```

### Déploiement avec Docker

L'image construit l'application puis la sert avec Nginx (le fichier `nginx.conf` redirige toutes les routes vers `index.html` pour que React Router fonctionne). Le fichier `.env` n'est pas copié dans l'image : l'URL de l'API doit être passée au build.

```sh
docker build --build-arg VITE_API_URL="https://url-de-l-api" -t hero-sos-front .
docker run -d -p 8080:80 hero-sos-front
```

L'application est alors disponible sur [http://localhost:8080](http://localhost:8080).

En production, le front n'est pas lancé seul : il est construit et déployé avec l'API par le `docker-compose.prod.yml` du [dépôt de l'API](https://github.com/tomfrx12/Hero-SOS-API#déploiement-en-production), derrière Traefik. Il est en ligne sur [heros-sos.tom-fourneaux.fr](https://heros-sos.tom-fourneaux.fr/).

## Scripts disponibles

| Commande          | Description                                        |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Lance le serveur de développement                  |
| `npm run build`   | Vérifie les types et génère le build de production |
| `npm run preview` | Sert le build de production en local               |
| `npm run lint`    | Analyse le code avec ESLint                        |

## Structure du projet

```
├── public/            # Images et robots.txt
├── src/
│   ├── composants/    # Composants réutilisables (layouts, champs, routes protégées…)
│   │   └── ui/        # Composants d'interface (boutons, cartes, pagination…)
│   ├── contexte/      # Session de l'utilisateur connecté
│   ├── pages/         # Pages publiques
│   │   ├── admin/     # Pages du tableau de bord administrateur
│   │   └── profil/    # Pages de l'espace profil
│   ├── services/      # Appels à l'API
│   ├── App.tsx        # Déclaration des routes
│   └── main.tsx       # Point d'entrée
├── Dockerfile
├── nginx.conf
└── vite.config.ts
```

## Pages

### Pages publiques

| Route                           | Page                                 |
| ------------------------------- | ------------------------------------ |
| `/`                             | Accueil                              |
| `/super-heros`                  | Liste des super-héros                |
| `/super-vilains`                | Liste des super-vilains              |
| `/incidents`                    | Liste des incidents                  |
| `/mentions-legales`             | Mentions légales                     |
| `/politique-de-confidentialite` | Politique de confidentialité         |

### Authentification (visiteurs non connectés uniquement)

| Route                             | Page                      |
| --------------------------------- | ------------------------- |
| `/connexion`                      | Connexion                 |
| `/inscription`                    | Inscription rapide (email et mot de passe) |
| `/reinitialiser-le-mot-de-passe`  | Mot de passe oublié       |

### Pages réservées aux profils complets

Un compte créé par l'inscription rapide est redirigé vers `/profil/completer` tant que son profil n'est pas complet.

| Route          | Page                                  |
| -------------- | ------------------------------------- |
| `/blog`        | Liste des articles publiés            |
| `/blog/:id`    | Lecture d'un article                  |
| `/videotheque` | Films recommandés par les super-héros |

### Espace profil (utilisateurs connectés)

| Route                        | Page                          | Rôles                       |
| ---------------------------- | ----------------------------- | --------------------------- |
| `/profil`                    | Profil                        | Tous                        |
| `/profil/completer`          | Complétion du profil          | Tous                        |
| `/profil/informations`       | Informations personnelles     | Tous                        |
| `/profil/incidents`          | Mes incidents                 | Citoyens, Administrateurs   |
| `/profil/signaler-incidents` | Signaler un incident          | Citoyens, Administrateurs   |
| `/profil/interventions`      | Interventions                 | Super-héros                 |
| `/profil/films`              | Ma vidéothèque (recherche et ajout de films) | Super-héros  |
| `/profil/vilains`            | Gestion des super-vilains     | Super-héros                 |
| `/profil/statistiques`       | Statistiques                  | Super-héros                 |
| `/profil/reputation`         | Réputation                    | Super-héros                 |

### Tableau de bord administrateur (administrateurs uniquement)

| Route                              | Page                      |
| ---------------------------------- | ------------------------- |
| `/dashboard-admin`                 | Tableau de bord           |
| `/dashboard-admin/incidents`       | Gestion des incidents     |
| `/dashboard-admin/incidents/:id`   | Détail d'un incident      |
| `/dashboard-admin/utilisateurs`    | Gestion des utilisateurs  |
| `/dashboard-admin/utilisateurs/:id`| Détail d'un utilisateur   |
| `/dashboard-admin/avis`            | Gestion des avis          |
| `/dashboard-admin/films`           | Validation des films de la vidéothèque |
| `/dashboard-admin/newsletter`      | Gestion de la newsletter  |
| `/dashboard-admin/vilains`         | Gestion des super-vilains |
| `/dashboard-admin/articles`        | Gestion des articles du blog |
| `/dashboard-admin/articles/nouveau`| Écriture d'un nouvel article |
| `/dashboard-admin/articles/:id/modifier` | Modification d'un article |

## Rôles et accès

L'application gère trois rôles : **Citoyens**, **SuperHeros** et **Administrateurs**. Les super-vilains n'ont pas de compte. Un citoyen peut demander à devenir super-héros depuis `/profil/informations`. Après la connexion, le jeton renvoyé par l'API est stocké dans le `localStorage` et envoyé à chaque requête (`Authorization: Bearer <token>`). Les administrateurs sont redirigés vers `/dashboard-admin`, les autres utilisateurs vers `/profil`.

## Auteurs

- **[Tom Fourneaux](https://tom-fourneaux.fr)** - [LinkedIn](https://www.linkedin.com/in/tom-fourneaux-4a8b31384) - [GitHub](https://github.com/tomfrx12)
- **[Nino Rameau](https://nino-rameau.fr)** - [LinkedIn](https://www.linkedin.com/in/nino-rameau-1a0636332/) - [GitHub](https://github.com/Nino-Rameau)

## Licence

Réalisé dans le cadre scolaire en octobre 2026.
