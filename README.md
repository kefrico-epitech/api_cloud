
# Cloud Media API - API REST pour le téléchargement de fichiers

Ce projet est une API REST construite avec Node.js et Express.js permettant le téléchargement, la gestion et la récupération de fichiers média. Elle prend en charge les images, les vidéos, les documents, les fichiers compressés, et plus encore.

## Fonctionnalités

- **Téléchargement de fichiers** (unique ou multiple) via Multer.
- **Consultation des fichiers** téléchargés en fonction de leur type (image, vidéo, document, etc.).
- **Suppression de fichiers** du serveur.
- **Statistiques** de stockage (taille totale des fichiers stockés).
- **Liste des images** disponibles.
- **Support CORS**.

## Prérequis

- [Node.js](https://nodejs.org/) (version 12 ou supérieure)
- [npm](https://www.npmjs.com/)

## Installation

1. Clonez le dépôt :
    ```bash
    git clone https://github.com/kefrico-epitech/api_cloud.git
    ```

2. Accédez au dossier du projet :
    ```bash
    cd repo-name
    ```

3. Installez les dépendances :
    ```bash
    npm install
    ```

## Configuration

Assurez-vous de définir l'origine CORS dans un fichier `.env` à la racine du projet :
```env
CORS_ORIGIN=http://localhost:3000
```

## Utilisation

1. Démarrez le serveur :
    ```bash
    node app.js
    ```

2. Le serveur est accessible sur `http://localhost:3000`.

## Endpoints

### 1. Téléchargement d'un fichier unique

- **URL** : `/upload/single`
- **Méthode** : `POST`
- **Description** : Télécharge un fichier unique.

### 2. Téléchargement multiple de fichiers

- **URL** : `/upload/multi`
- **Méthode** : `POST`
- **Description** : Télécharge plusieurs fichiers (jusqu'à 5 fichiers).

### 3. Récupération de la liste des images

- **URL** : `/images`
- **Méthode** : `GET`
- **Description** : Récupère la liste des fichiers images disponibles.

### 4. Suppression d'un fichier

- **URL** : `/delete/:filename`
- **Méthode** : `DELETE`
- **Description** : Supprime un fichier du serveur.

### 5. Statistiques de stockage

- **URL** : `/stats`
- **Méthode** : `GET`
- **Description** : Récupère la taille totale des fichiers stockés.

### 6. Récupération des fichiers par type

- **URL** : `/files/:type`
- **Méthode** : `GET`
- **Paramètre** : `type` (image, video, document, zip, music)
- **Description** : Récupère les fichiers en fonction de leur type.

## Technologies utilisées

- [Express.js](https://expressjs.com/)
- [Multer](https://www.npmjs.com/package/multer) - Gestion du téléchargement de fichiers
- [Cors](https://www.npmjs.com/package/cors) - Support CORS
- [Colors](https://www.npmjs.com/package/colors) - Mise en couleur des logs console

## License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.
