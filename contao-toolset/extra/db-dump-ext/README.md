# lazycommit-db-ext

> Erstellt mysqldump der Live Seite via ssh.

# HOW TO USE

1. In der `credentials.json` Daten eintragen für `SSH` `Datenbank`
2. kopiere die Erweiterungsdatei in den Ordner contao-toolset auf der Ebene von gulpfile.js
3. Gulp befehl ausführen

```
gulp dump_db
```

# Test Connection

Wird beim starten des Contao Toolset immer angezeigt in der Checkliste

Manueller Test verfügbar :

```
gulp ssh_connection_test
gulp db_connection_test
```
