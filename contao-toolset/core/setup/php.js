const {
  verify_php_73,
  verify_php_74,
  verify_php_81
} = require("../verify/verify")
const {
  prompt_toggle,
} = require('../prompts/prompts')
const {
  install_php_73,
  install_php_74,
  install_php_81
} = require("../../extra/php-versionswitch-ext/php-versionswitch-ext")

module.exports = {
  php: async function () {
    return new Promise(async function (resolve, reject) {
      let verified_php_73 = await verify_php_73();
      let verified_php_74 = await verify_php_74();
      let verified_php_81 = await verify_php_81();

      if (!verified_php_73 || !verified_php_74 || !verified_php_81) {
        let accept = await prompt_toggle("Installation fehlender PHP Versionen beginnen" + " (benötigt)".red)

        if (accept.value) {
          if (!verified_php_73) {
            await install_php_73()
          }
          if (!verified_php_74) {
            await install_php_74()
          }
          if (!verified_php_81) {
            await install_php_81()
          }
          resolve(true);
        }
        resolve(false);
      }
      resolve(true);
    });
  },
};