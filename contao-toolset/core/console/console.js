const boxen = require("boxen");
const SymfonyStyle = require("symfony-style-console").SymfonyStyle;
const ora = require("ora");
const inquirer = require("inquirer");
const credentials = require("../../credentials.json");
const {verify_foldername} = require("../verify/verify");

module.exports = {
  toolset__title: async function () {
    console.log(
      boxen(" Tasks made Easy !".yellow, {
        title: "Contao Toolset".brightCyan,
        titleAlignment: "center",
        borderColor: "yellow",
      })
    );
  },
  toolset__info: async function () {
    let foldername = await verify_foldername();
    console.log(
      boxen(
        `dev-url: `.brightMagenta +
        "https://"+foldername.basename +
        "\n" +
        `ssh-username: `.brightCyan +
        credentials.SSH_USERNAME +
        "\n" +
        `ssh-password: `.brightCyan +
        credentials.SSH_PASSWORD +
        "\n" +
        `Run ` +
        `npm run help`.green +
        ` to get a full list of commands`, {
          padding: 1,
          titleAlignment: "center",
          textAlignment: "left",
          borderColor: "cyan",
        }
      )
    );
  },
  boxen: async function (text) {
    console.log(
      boxen(text.yellow, {
        borderColor: "cyan",
        padding: 1,
        margin: 1,
        borderStyle: "double",
      })
    );
  },
  ora_loading_start: async function () {
    const spinner = ora("").start();
    spinner.color = "yellow";
    spinner.text = "Downloading Files Please Wait";

    return spinner;
  },
  ora_loading_default_start: async function (message = "Loading Start") {
    const spinner = ora("").start();
    spinner.color = "yellow";
    spinner.text = message;

    return spinner;
  },
  ora_loading_stop: async function (spinner) {
    spinner.text = "Download Complete";
    spinner.succeed();
  },
  ora_loading_default_stop: async function (
    spinner,
    message = "Loading Complete"
  ) {
    spinner.text = message;
    spinner.succeed();
  },
  ora_loading_default_stop_fail: async function (
    spinner,
    message = "Loading Complete"
  ) {
    spinner.text = message;
    spinner.fail();
  },
  symfony_success: async function (message) {
    const io = new SymfonyStyle();
    io.success(message);
  },
  symfony_warning: async function (message) {
    const io = new SymfonyStyle();
    io.warning(message);
  },
  symfony_info: async function () {
    const io = new SymfonyStyle();
    // `block` serves to group content, with a certain styling.
    io.block(
      [
        "This gets indented as well.",
        "Use this to indent a bunch of text next to a keyword.",
      ],
      "INFO",
      "fg=black;bg=blue",
      " i ",
      true
    );
  },
  symfony_title: async function (message) {
    const io = new SymfonyStyle();
    io.title(message);
  },

  prompt_phpversion: async function () {
    inquirer.registerPrompt("table", require("./table"));

    const answers = await inquirer.prompt([{
      type: "table",
      name: "Entwicklungsumgebung",
      message: "Wähle PHP Version für deine Entwicklungsumgebung",
      columns: [{
          name: "PHP 7.3",
          value: "7.3",
        },
        {
          name: "PHP 7.4",
          value: "7.4",
        },
        {
          name: "PHP 8.1",
          value: "8.1",
        },
      ],
      rows: [{
        name: "Entwicklungsumgebung",
        value: 0,
      }, ],
    }, ]);

    return answers;
  },
};