const fs = require("fs-extra");
const contao_toolset_conf = "./contao-toolset/contao_toolset.json";
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const {
  verify_dev_env,
} = require("../verify/verify");
const {
  prompt_toggle,
} = require('../prompts/prompts')
const os = require("os");
const userHomeDir = os.homedir();

module.exports = {
  docker: async function () {
    return new Promise(async function (resolve, reject) {
      await module.exports.install();
      resolve(true);
    });
  },
  // ##COMMMENT 
  install: async function () {
    return new Promise(async function (resolve, reject) {

      let verfified_dev_env = await verify_dev_env();
      if (!verfified_dev_env) {
        let accept = await prompt_toggle("Installation fehlender Docker Umgebung beginnen" + " (benötigt)".red)

        if (accept.value) {
            await module.exports.install_env()
        }
      }

      resolve(true);
    });
  },
  install_env: async function () {
    return new Promise(async function (resolve, reject) {

      await exec("git clone git@gitlab.lupcom.de:dev-env/steffen.git dev-env", {
        cwd: userHomeDir + "/www"
      });

      console.log("✅ Entwicklungsumgebung hinzugefügt:".green + `${userHomeDir}/www`.brightCyan)

      resolve(true);
    });
  },
};