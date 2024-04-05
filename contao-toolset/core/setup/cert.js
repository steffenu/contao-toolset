const fs = require("fs-extra");

const os = require("os");
const userHomeDir = os.homedir();
const {
  current_root_foldername
} = require('./environment');
const {
  prompt_toggle,
  prompt_select
} = require('../prompts/prompts');
const {
  current_dev_env
} = require("./environment");

const util = require('util');
var exec = util.promisify(require('child_process').exec);

module.exports = {
  cert: async function () {
    return new Promise(async function (resolve, reject) {
      await module.exports.create_cert();

      resolve(true);

    });
  },
  create_cert: async function () {
    return new Promise(async function (resolve, reject) {

      let path = require("path");
      let foldername = await current_root_foldername();
      foldername = path.basename(foldername);
      console.log('foldername:', foldername)
      await exec(`mkcert ${foldername}`, {
        cwd: userHomeDir + "/www/dev-env/certs/"
      })

      resolve(true);

    });
  },

};