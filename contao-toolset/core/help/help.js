const commandLineUsage = require("command-line-usage");


module.exports = {
help: async function (foldername) {

  const sections = [{
      header: `Contao Toolset`,
      content: "Tasks to be automated ",
    },
    {
      header: "Synopsis",
      content: "$ npm run" + " <command>".brightCyan,
    },
    {
      header: "Command List",
      content: [{
          name: "start".brightCyan,
          summary: "Ersteinrichtung + startet Watcher für automatische Aktionen bei Dateiänderungen",
        },
        {
          name: "settings".brightCyan,
          summary: "Watcher Konfigurieren"
        },
        {
          name: "project",
          summary: "Assistent - Neues Contao Projekt erstellen"
        },
        {
          name: "demo_domain",
          summary: "Assistent - Demo Domain FTP Server Ersteinrichtung",
        },
        {
          name: "templates_create".brightCyan,
          summary: "Erzeuge Inhaltselemente oder Bundles",
        },
        {
          name: "import_db",
          summary: "Live zu Dev Import"
        },
        {
          name: "export_db",
          summary: "Dev zu Live Export"
        },
        {
          name: "files",
          summary: "Download des files Ordners" + " (via sftp)".brightMagenta
        },

        {
          name: "test_ssh",
          summary: "Verbindungstest SSH"
        },
        {
          name: "test_db",
          summary: "Verbindungstest DB" + " (remote)".brightMagenta
        },
        // {
        //   name: "chrome",
        //   summary: "Starte Chrome in Debug Modus " + "(für Puppeteer benötigt)".brightMagenta
        // },
        {
          name: "report",
          summary: "Generiert Projekt Report "+ "(.pdf)".brightMagenta
        },

      ],
    },
  ];

  const usage = commandLineUsage(sections);
  console.log(usage);
  return true;
},

}