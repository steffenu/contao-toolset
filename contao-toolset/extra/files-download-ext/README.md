# files-download-ext

> Downloaded den Files-Ordner der Live Seite via sftp.

# HOW TO USE

1. In der `credentials.json` Daten eintragen für `SSH` , `Datenbank` , `SFTP_FILEPATH` (default = html/contao/files)
2. kopiere die Erweiterungsdatei auf in den Ordner LazyCommit-Extensions auf der Ebene von gulpfile.js
3. Gulp befehl ausführen

```
gulp download_dir
```