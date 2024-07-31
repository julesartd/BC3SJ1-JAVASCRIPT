## Prérequis

1. **Télécharger FileZilla**: Assurez-vous d'avoir installé FileZilla. Vous pouvez le télécharger [ici](https://filezilla-project.org/).
2. **Informations de connexion**: Vous aurez besoin de l'adresse du serveur, du nom d'utilisateur, du mot de passe, et du port (optionnel).

## Se connecter via SFTP

1. **Ouvrir FileZilla**.

2. **Configurer une connexion SFTP**:
   - **Hôte**: Entrez l'adresse IP ou le nom de domaine de votre serveur précédé de `sftp://` (ex. `sftp://exemple.com`).
   - **Nom d'utilisateur**: Saisissez votre nom d'utilisateur.
   - **Mot de passe**: Entrez votre mot de passe.
   - **Port**: Entrez `22` (le port SFTP par défaut).
    *Ces données vous sont fournis avec vos identifiants*
3. **Connexion rapide**:
   - Cliquez sur le bouton `Connexion rapide` ou appuyez sur `Entrée`.
![[Pasted image 20240731115131.png]]
4. **Naviguer sur le serveur**:
   - Comme avec FTP, vous pouvez utiliser les panneaux pour gérer vos fichiers locaux et distants.

## Utiliser le gestionnaire de sites

Pour enregistrer vos paramètres de connexion, vous pouvez utiliser le gestionnaire de sites de FileZilla.

1. **Ouvrir le gestionnaire de sites**:
   - Allez dans `Fichier` > `Gestionnaire de sites...`.

2. **Ajouter un nouveau site**:
   - Cliquez sur `Nouveau site` et donnez-lui un nom.

3. **Configurer le site**:
   - Remplissez les informations nécessaires (Hôte, Port, Protocole, Mode de connexion, etc.).

4. **Enregistrer et se connecter**:
   - Cliquez sur `OK` pour enregistrer vos paramètres. Vous pouvez maintenant vous connecter en sélectionnant votre site dans le gestionnaire.
![[Pasted image 20240731115114.png]]
## Remarques supplémentaires

- **Connexion sécurisée**: Pour des connexions sécurisées, utilisez toujours SFTP ou FTPS.
- **Mode passif**: Si vous rencontrez des problèmes de connexion, essayez de passer en mode passif (dans les paramètres de FileZilla).