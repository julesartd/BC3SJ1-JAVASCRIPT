# Guide d'installation

## Installation en local

### Initialiser le projet

1. Verifier la présence de Node.js et NPM
```shell
node -v
npm -v
```


2. installer les dépendances
```shell
npm i
```
```shell 
cd client
npm i
cd  ..
```

2. Importer le script SQL dans votre base de donnée
```shell
    mysql -u [username] -p [database_name] < ./config/library.sql
```
Un mot de passe vous sera alors demandé, dans le cas ou aucun mot de passe n'es configuré sur votre base, vous pouvez retirer le `-p`
Par exemple pour un utilisateur root sans mot de passe avec une base de donnée library:
```shell
    mysql -u root library < ./config/library.sql
```


### Lancer le projet


**Afin de lancer le projet en local, commentez la ligne 8 ( base ) du ficher vite.config.js ( celle ci doit être décommentée pour la mise en production" ) en cas de build en local, récupérez le fichier ou son contenu : .env.production du dossier client**

**En cas de problème baseURL : indiquez une variable baseURL avec comme valeure : ""** 

1. Exécuter le serveur et le client dans 2 terminaux différents
```shell
node app.js
```
```shell
cd client
npm run dev
```

2. Accéder à l'Application
Ouvrez votre navigateur et allez sur la page http://localhost:5174 et http://localhost:3000 pour l'api.

Attention les appels API ne sont pas diriger vers le 3000, il faut donc les modifiers

3. Connexion
Connectez vous à l'aide d'un des comptes via la page Connexion
**Rôle Admin :**
```
john@smith.com
azerty
```

OU
**Rôle utilisateur :**
```
marc@lord.com 
azerty
```

## Installation distant

Le projet est pré-déployé sur le lien reçu au début de votre examen.
Ce lien vous permet d'accèder au projet via un lien HTTPs

Vous avez une connexion sFTP disponible et SSH afin de modifier ce projet en conséquence
Attention, prévoyez bien vos modifications en local et testez bien ces dernières avant de les déployers.


## Accès sFTP

Pour l'accès sFTP l'utilisation de FileZilla est recommandé, vous trouverez un fichier explicatif dans le dossier docs

## Accès MySQL

Pour l'accès MySQL le ssh est nécessaire, Vous pouvez vous connecter en ssh au serveur avec : `ssh [nom principal]@exam.andragogy.fr -p [port SSH]`, vous trouverez un fichier explicatif pour MySQL dans le dossier docs

## Déploiement

Le serveur est surveillé par nodemon, dès qu'un fichier est modifié, celui ci se met à jour, les fichiers et dossier couvert sont ceux présent dans `/var/www/html`

Pour la partie front react, 2 options de build sont possible :
1 . Build local 

Vous réalisez le build en local, et envoyer le contenu généré dans le dossier : `/var/www/html/webpub`

2 . Build distant

Vous transferer vos fichiers React brut ( hors node_modules, package-lock.json et fichiers env ) dans le dossier `/var/www/html/client`

*** Attention, le fichier env production doit rester intact sur le serveur afin que l'adresse HTTPs reste fonctionnel, les node_modules et package-lock seront regénérez lors de l'installation***

Puis 
- Vous connectez en ssh au serveur avec : `ssh [nom principal]@exam.andragogy.fr -p [port SSH]`
- Vous renseignez votre mot de passe et validez la clé avec yes
- Vous placez dans le dossier client : `cd client`
- Réalisez l'installation avec : `npm i`
- Réalisez le build avec : `npm run build`

Le déploiement Front est alors achevé


La commande pour passer root en SSH est :
```shell
    su
```
Puis indiquer votre mot de passe