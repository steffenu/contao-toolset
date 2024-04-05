const {
  get_php_version,
} = require("../../../core/php-versioncheck/php-versioncheck");
const {
  install_php_73,
  install_php_74,
  install_php_81,
  get_php_version_list,
  switch_php_version,
} = require("../../../extra/php-versionswitch-ext/php-versionswitch-ext");

module.exports = {
  // #######################################
  // set php_version based on contao_version
  // #######################################

  php_version: async function (contao_version) {
    return new Promise(async function (resolve, reject) {
      let orignal_php_version =
        module.exports.switch_and_install(contao_version);
      resolve(orignal_php_version);
    });
  },

  switch_and_install: async function (contao_version) {
    //console.log("contao_version:", contao_version);

    if (contao_version.value == "5") {
      var active_required_version = "8.1";
    }
    if (contao_version.value == "4.13") {
      var active_required_version = "7.4";
    }
    if (contao_version.value == "4.9") {
      var active_required_version = "7.3";
    }

    //console.log("active_required_version:", active_required_version);
    return new Promise(async function (resolve, reject) {
      let php_version = await get_php_version(); // 7.3 , 7.4 , 8.1

      let php_versionlist = await get_php_version_list();
      if (php_versionlist.includes(active_required_version)) {
        if (contao_version.value == "4.9" && php_version == "7.3") {
          console.log(
            " switch_and_install ".bgWhite.black +
              ` Verwende PHP ${php_version} `
                .bgMagenta.black
          );
          // do nothing
        } else if (contao_version.value == "4.13" && php_version == "7.4") {
          console.log(
            " switch_and_install ".bgWhite.black +
              ` Verwende PHP ${php_version} `
                .bgMagenta.black
          );
          // do nothing
        } else if (contao_version.value == "5" && php_version == "8.1") {
          console.log(
            " switch_and_install ".bgWhite.black +
              ` Verwende PHP ${php_version} `
                .bgMagenta.black
          );
          // do nothing
        } else if (contao_version.value == "4.9" && php_version != "7.3") {
          await switch_php_version("7.3");
          console.log("===================================".verbose);
          console.log("         SWITCH TO PHP 7.3         ".verbose);
          console.log("===================================".verbose);
          console.log("Contao:" + " 4.9".warn);
        } else if (contao_version.value == "4.13" && php_version != "7.4") {
          await switch_php_version("7.4");
          console.log("===================================".verbose);
          console.log("         SWITCH TO PHP 7.4         ".verbose);
          console.log("===================================".verbose);
          console.log("Contao:" + " 4.13".warn);
        } else if (contao_version.value == "5" && php_version != "8.1") {
          await switch_php_version("8.1");
          console.log("===================================".verbose);
          console.log("         SWITCH TO PHP 8.1         ".verbose);
          console.log("===================================".verbose);
          console.log("Contao:" + " 5".warn);
        }
        resolve(php_version); // original php version to switch back to
      } else {
        if (contao_version.value == "4.9") {
          console.log("===================================".info);
          console.log("         INSTALLING PHP 7.3        ".info);
          console.log("===================================".info);
          let installed = await install_php_73();
          await switch_php_version("7.3");
          console.log("===================================".verbose);
          console.log("         SWITCH TO PHP 7.3         ".verbose);
          console.log("===================================".verbose);
          console.log("Contao:" + " 4.9".warn);
        }
        if (contao_version.value == "4.13") {
          console.log("===================================".info);
          console.log("         INSTALLING PHP 7.4        ".info);
          console.log("===================================".info);
          await install_php_74();
          await switch_php_version("7.4");
          console.log("===================================".verbose);
          console.log("         SWITCH TO PHP 7.4         ".verbose);
          console.log("===================================".verbose);
          console.log("Contao:" + " 4.13".warn);
        }
        if (contao_version.value == "5") {
          console.log("===================================".info);
          console.log("         INSTALLING PHP 8.1        ".info);
          console.log("===================================".info);
          await install_php_81();
          await switch_php_version("8.1");
          console.log("===================================".verbose);
          console.log("         SWITCH TO PHP 8.1         ".verbose);
          console.log("===================================".verbose);
          console.log("Contao:" + " 5".warn);
        }
        resolve(php_version); // original php version to switch back to
      }
    });
  },
};
