
const util = require('util');
var exec = util.promisify(require('child_process').exec);
const {
  watch
} = require("gulp");

const notifier = require('node-notifier');

var isWatcherActive_compposer_install = true;
const { verify_foldername } = require("../../../../core/verify/verify");
const {ora_loading_default_start,ora_loading_default_stop,ora_loading_default_stop_fail} = require("../../../../core/console/console");


module.exports = {
  autocomposer_container: async function (data) {
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

      /*           console.log(`docker exec dev-env_${fpm_version} sh -c "cd ${folername.basename} && vendor/bin/contao-console contao:automator purgeScriptCache && /bin/sh"`); */

      console.log(
        "autocomposer_container".info.bgBlack,
        `composer install`.black.dim
      );
      
      let spinner = await ora_loading_default_start(`composer install in container ${fpm_version}`);
        await exec(
          `docker exec dev-env_${fpm_version} sh -c "cd ${folername.basename} && php composer.phar install && /bin/sh"`,
          function (err, stdout, stderr) {
            if (err) {
              ora_loading_default_stop_fail(spinner,"composer install fehlgeschlagen");
              console.log(err.message.error);
              resolve(false);
              
            }else{
              ora_loading_default_stop(spinner,`composer install für ${fpm_version} abgeschlossen`)
              resolve(true);
            }
          }
        );
        
      } catch (error) {
        resolve(false);
      console.log('error:', error)
      
        notifier.notify({
          title: 'Contao Toolset',
          message: 'composer_install - wrong php version',
        }, );
      
      }
    
    });
  },
};