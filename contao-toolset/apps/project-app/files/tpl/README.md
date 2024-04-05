# tpl Ordner

> Enthält Layout relevante styles , fonts , images. Assets für Inhaltselemente befinden sich dann aber im CustomElementsBundle. Somit liegen zusammenhängende Dateien zusammen ( Controller , template , styles usw).


# LoadScript Bundle 

> Über das Loadscript Bundle laden wir Assets aus dem tpl Ordner welche auf allen Seiten eingebunden werden.


# CustomElementsBundle Assets laden

> Die Styles von Inhaltselemente laden wir nur dann wenn Sie auch auf einer Seite verwendet werden. Der Sass Compiler des Contao Toolsets kümmert sich um das Autoprefixing , welches das Loadscriptbundle auch macht.