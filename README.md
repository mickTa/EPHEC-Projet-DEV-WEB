# Projet Dev Web 

## Membres du groupe

| Nom                | Pseudo Github      | 
| ------------------ | ------------------ | 
| Mickaël TALIDEC    | mickTa             | 
| Sydney TEXIER      | MrNobody005        | 
| Charlie AUBOURG    | CharlieAubourg1    | 
| Bogomir STOYANOV   | bogogod            |
| Jérémie MUCHEMBLED | jeremie-78         |

## Structure du Projet

```
mickta-ephec-projet-dev-web/
├── client/ # Application mobile (Expo/React Native)
├── server/ # API REST (Express + PostgreSQL)
├── Dumps/ # Dump SQL 
├── fileTester/ # Script de test des endpoints API (pour le moment)
└── img/ # Contenus statiques
```

## 🔐 Authentification & Rôles

- Authentification via JWT
- Rôles supportés :
  - `USER`
  - `ORGANIZER`
  - `ADMIN`

## 📱 Fonctionnalités principales

- Connexion et inscription d'utilisateurs
- Création et gestion d'événements par les organisateurs
- Inscription/désinscription à un événement
- Visualisation des événements disponibles
- Gestion d’un portefeuille numérique par événement
- Génération et scan de QR codes de portefeuille
- Ajout de crédits à un portefeuille
- Upload de photo de profil et d’image d’événement

## 🛠️ Installation

### Prérequis

#### Dump la base de donnée dans votre environnement local : 

1. Créer une nouvelle base de données (vide)

- Dans pgAdmin, clic droit sur "Databases" → Create > Database...
- Donner un nom à la base (ex. : qufest_db_copy)
- Valider

2. Restaurer le fichier .backup

- Clic droit sur la nouvelle base → Restore...

##### Paramétrer :

- Format : Custom or tar
- Filename : Sélectionner le fichier dump-sql.backup (dans le dossier Dumps du projet)

##### Aller dans l’onglet Restore options :

- Cocher la case "No owner" (pour ignorer les rôles d’origine)
- Cocher la case "No privilèges" (pour ignorer les permissions d’origine)

Lancer la restauration en cliquant sur Restore

#### Utilisation de la version web

- Node.js 
- PostgreSQL
- `npm install` à la racine du projet 

##### Variables d'environnement

Il y a deux fichiers .env à créer :

###### Dans le dossier server :
```
DATABASE_URL=postgres://<url de votre BDD dans postgre, créer grâce au Dump>
JWT_SECRET=
QR_ENCRYPTION_KEY=
QR_HMAC_KEY=
CLOUDINARY_URL=
```

###### Dans le dossier client :

```
LOCALHOST_API=http://localhost:3000/api
LAN_API=http://<votre adresse ip:3000/api // Lors du déploiement ce sera l'ip d'un de nos vps
```
##### Clé de connexion Firebase :

Pour lancer l'API il est nécéssaire d'avoir unn fichier ```firebaseConfig.json``` qui comporte la clé de connexion à votre projet Firebase Cloud Firestore. Ce fichier doit êre placé dans le dossier /server
Il doit ressembler à : 

```
{
  "type": "",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_email": "",
  "client_id": "",
  "auth_uri": "",
  "token_uri": "",
  "auth_provider_x509_cert_url": "",
  "client_x509_cert_url": "",
  "universe_domain": ""
}
```
#### Version mobile (Android)

- Node.js 
- PostgreSQL
- `npm install` à la racine du projet

#### Installation de Android Studio

[](https://developer.android.com/studio)

##### Installation de Jabba : 

```iwr -useb https://raw.githubusercontent.com/shyiko/jabba/master/install.ps1 | iex``` (terminal PowerShell)

##### Installer et utiliser JDK 17 :

- jabba install openjdk@1.17.0
- jabba use openjdk@1.17.0

Pour vérifier --> `java --version`

#### Définir des variables d'environnements (dans votre ordinateur) :


Définir les variables `ANDROID_HOME` (si ça n'a pas été fait automatiquement lors de l'installation de Android Studio) et `JAVA_HOME` 
et leur assigner les chemins qui leur correspondent. : 

Exemple : 
```
Pour ANDROID_HOME --> C:\Users\<votre-user>\AppData\Local\Android\Sdk
Pour JAVA_HOME    --> C:\Users`<votre-user>.jabba\jdk\openjdk@1.17.0"
```

Et enfin, aller dans `Path` pour mettre les deux variables que vous avez créé :

%JAVA_HOME%\bin
%ANDROID_HOME%\emulator

#### Build de l'application sur l'appareil physique (android) ou sur emulateur (Android Studio)

Faire la commande `npx expo run:android` dans le dossier client (pour construire l'app sur l'appareil physique, il faut connecter en usb et activer le mode Debug USB dans les options de developpement)

Cette opération peut durer un certains moments (entre 15-20 min)

Une fois le "BUILD SUCCESSFULL" le serveur frontend va se lancer.

### Lancement du projet en local

#### Backend (API)

```bash
cd server
npm run dev
```

#### Frontend (Application mobile)

Dans un autre terminal :

```bash
cd client
npx expo start (vous pouvez rajouter l'option -c pour reset le cache)
```
