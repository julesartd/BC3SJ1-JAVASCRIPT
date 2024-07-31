# MySQL

## Utilisation

MySQL est installé sur le serveur sur le port par défaut : 3306

## Accès

Vous pouvez accéder à MySQL grace à la commande suivante :
```shell
    mysql -u [username] -p [database_name]
```
Un mot de passe vous sera alors demandé, dans le cas ou aucun mot de passe n'es configuré sur votre base, vous pouvez retirer le `-p`
Par exemple pour un utilisateur root sans mot de passe avec une base de donnée library:


Les identifiants par defaut sont :
**Username** : libr
**Password** : NIEN97BF21OZEFJOZEO
**Database** : library

## Import de dump

Vous pouvez importer un dump de votre base de donnée local ( préalablement envoyé par sFTP ) avec la commande suivante : 
```shell
    mysql -u [username] -p [database_name] < [Chemin/Fichier.sql]
```
Un mot de passe vous sera alors demandé, dans le cas ou aucun mot de passe n'es configuré sur votre base, vous pouvez retirer le `-p`
Par exemple pour un utilisateur `root` sans mot de passe avec une base de donnée `library` et un fichier dans le dossier `config/library.sql`:
```shell
    mysql -u root library < ./config/library.sql
```
