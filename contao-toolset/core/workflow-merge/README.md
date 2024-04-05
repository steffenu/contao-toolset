# workflow-merge

> Befindet man sich in einem hotfix oder feature branch wird beim pushen (mit lazycommit) die jeweilige merge Strategie angeboten

# Merge Strategien

### Hotfix Merge Strategie

> Die Hotfix Merge Stragie erstellt einen Branch welcher vom Master branch abzweigt.Dieser Branch wird dann mit dem develop und master branch gemerged.
> develop und master werden dabei nicht gemerged. Änderungen die somit noch nicht in die live Umgebung sollen bleiben vorerst im develop branch solange bis die Feature Merge Strategie benutzt wird.

```
git checkout develop
git merge hotfix-1
git checkout master
git merge hotfix-1
```

### Feature Merge Strategie

> Die Feature Branch Merge Strategie erstellt einen Branch welcher vom develop abzweigt. Zuerst wird develop mit dem feature branch gemerged, anschliessend dann der master branch mit dem develop branch. Somit wird von unten nach oben durchgemerged.

```
git checkout develop
git merge feature-1
git checkout master
git merge develop
```

# How it Works

> Sofern es einen master und develop branch gibt , wird diese Erweiterung aktiv.
> Dann wird geschaut ob es bereits feature oder hotfix branches gibt und ein switch wird angeboten , ansonsten startet ein Branch-Erstellungs-Assistent
> mit anschliessenden switch zum erstellen Branch.

# Mehrere Entwickler

> Die Feature und Hotfix Strategie haben beide auch einen git pull. Damit wird immer der neuste stand gemmerged (develop oder master).Sollte ein anderer Entwickler also in der zwischenzeit z.B develop erweitert haben dann werden die neusten änderungen gepullt bevor du deinen push machst. Sofern nicht an den selben Datein gearbeitet wird sollten keine Konflikte auftreten. Für den Fall von Konflikten wird auch immer eine Konfliktliste ausgegeben ;). Das Programm bricht zurzeit in dem Fall dann ab und du musst Konflikte manuell beheben.

```

```

git checkout develop
git pull
git merge hotfix-1
git checkout master
git pull
git merge hotfix-1

```

```
