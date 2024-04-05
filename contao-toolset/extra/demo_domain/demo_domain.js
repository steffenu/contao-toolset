const { gitlab_ci } = require("./gitlab_ci");
const { ftp } = require("./ftp");
const { gitlab } = require("./gitlab");

module.exports = {
  demo_domain: async function (input) {
    return new Promise(async function (resolve, reject) {
      await gitlab_ci(); // create gitlab ci file
      await gitlab(); // check deploy key , ci / cd setting
      await ftp(); // setup all files on ftp

      resolve();
    });
  },
};
