# db-import-ext

Mit einem Klick remote Datenbank dumpen und importieren. !

> Benötigt db-dump-ext

1. Führt Datenbank Dump aus (credentials.json)
2. Importiert remote Dump in Lokale Datenbank (db_local.json)
3. Setzt DomainNamen Lokal in Contao ein 
4. Unchecks "HTTPS verweden"

```
npm run import_db

```
oder
```
gulp db_import_ext
```

Oder wie immer unter npm skripts einfach anklicken ;)
