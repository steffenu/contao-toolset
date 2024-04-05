# php-versioncheck

- PHP Versionsprüfung
- Prüfung ob Git Pull Nötig ist (using gitlab api)
- lazycommit.json erstellung

Beim verwenden von LazyCommit z.B ticket-push wird nun zusätlich immer geprüft ob deine aktive Php Version der php version die du mal festgelegt hast entspricht ! Somit wird verhindert das du z.B php 7.4 in einem Php 7.3 Projekt nutzt (sofern du lazycommit nuzt :)
