const util = require("util");
var exec = util.promisify(require("child_process").exec);
// var exec = require("child_process").exec;
const {
  watch
} = require("gulp");

const {
  verify_foldername
} = require("../../../verify/verify");

const notifier = require("node-notifier");

module.exports = {


  purgePageCache: async function () {
    return new Promise(async function (resolve, reject) {
      try {
        let contao_info_json = require("../../../../../contao-info.json");
        let project_php_version = contao_info_json.php_version;
        let folername = await verify_foldername();

        if (project_php_version == "7.3") {
          fpm_version = "php-fpm73_1";
        }
        if (project_php_version == "7.4") {
          fpm_version = "php-fpm74_1";
        }
        if (project_php_version == "8.1") {
          fpm_version = "php-fpm81_1";
        }
        if (project_php_version == "8.2") {
          fpm_version = "php-fpm82_1";
        }

        console.log("cache_clear_auto".info.bgBlack, `👷 purgePageCache`.warn);

        /*           console.log(`docker exec dev-env_${fpm_version} sh -c "cd ${folername.basename} && vendor/bin/contao-console contao:automator purgeScriptCache && /bin/sh"`); */
        // console.log(`docker exec dev-env_${fpm_version} sh -c "cd ${folername.basename} && vendor/bin/contao-console contao:automator purgePageCache && /bin/sh"`)
        await exec(
          `docker exec dev-env_${fpm_version} sh -c "cd ${folername.basename} && vendor/bin/contao-console contao:automator purgePageCache && /bin/sh"`,
          function (err, stdout, stderr) {
            //console.log('stdout:', stdout)
            if (err) {
              console.log(err.message.error);
              resolve(false)

            } else {
              resolve(true)
            }
          }
        );
        module.exports.purgePageCache();
      } catch (error) {
        console.log(
          "⚠ contao:automator purgePageCache had no effect - no vendor folder or wrong php version "
          .red
        );

        notifier.notify({
          title: "Contao Toolset",
          message: "contao:automator purgePageCache - wrong php version",
        });
        resolve(false)


      }
    });
  },



  purgeScriptCache: async function () {
    return new Promise(async function (resolve, reject) {

    try {
      let contao_info_json = require("../../../../../contao-info.json");
      let project_php_version = contao_info_json.php_version;

      let folername = await verify_foldername();

      let fpm_version = "php-fpm74_1"; // default

      if (project_php_version == "7.3") {
        fpm_version = "php-fpm73_1";
      }
      if (project_php_version == "7.4") {
        fpm_version = "php-fpm74_1";
      }
      if (project_php_version == "8.1") {
        fpm_version = "php-fpm81_1";
      }
      if (project_php_version == "8.2") {
        fpm_version = "php-fpm82_1";
      }

      console.log(
        "cache_clear_auto".info.bgBlack,
        `👷 purgeScriptCache`.warn
      );

      /*           console.log(`docker exec dev-env_${fpm_version} sh -c "cd ${folername.basename} && vendor/bin/contao-console contao:automator purgeScriptCache && /bin/sh"`); */
      await exec(
        `docker exec dev-env_${fpm_version} sh -c "cd ${folername.basename} && vendor/bin/contao-console contao:automator purgeScriptCache && /bin/sh"`,
        function (err, stdout, stderr) {
          //console.log('stdout:', stdout)
          if (err) {
            console.log(err.message.error);
            resolve(false)

          } else {
            resolve(true)
          }
        }
      );


    } catch (error) {
      console.log("error:", error);
      console.log("purgeScriptCache failed".error);
      resolve(false)

    }
  });
  },



  purgeImageCache: async function () {
    return new Promise(async function (resolve, reject) {

      try {

        let contao_info_json = require("../../../../../contao-info.json");
        let project_php_version = contao_info_json.php_version;
        let folername = await verify_foldername();

        if (project_php_version == "7.3") {
          fpm_version = "php-fpm73_1";
        }
        if (project_php_version == "7.4") {
          fpm_version = "php-fpm74_1";
        }
        if (project_php_version == "8.1") {
          fpm_version = "php-fpm81_1";
        }
        if (project_php_version == "8.2") {
          fpm_version = "php-fpm82_1";
        }

        console.log("cache_clear_auto".info.bgBlack, `👷 purgeImageCache`.warn);

        /*           console.log(`docker exec dev-env_${fpm_version} sh -c "cd ${folername.basename} && vendor/bin/contao-console contao:automator purgeScriptCache && /bin/sh"`); */
        //console.log(`docker exec dev-env_${fpm_version} sh -c "cd ${folername.basename} && vendor/bin/contao-console contao:automator purgeImageCache && /bin/sh"`)
        await exec(
          `docker exec dev-env_${fpm_version} sh -c "cd ${folername.basename} && vendor/bin/contao-console contao:automator purgeImageCache && /bin/sh"`,
          function (err, stdout, stderr) {
            //console.log('stdout:', stdout)
            if (err) {
              console.log(err.message.error);
              resolve(false)
            } else {
              resolve(true)
            }
          }
        );
      } catch (error) {
        console.log("error:", error);
        console.log(
          "⚠ contao:automator purgeImageCache had no effect - no vendor folder or wrong php version "
          .red
        );

        notifier.notify({
          title: "Contao Toolset",
          message: "contao:automator purgeImageCache - wrong php version",
        });
        resolve(false)
      }
    });
  },

};