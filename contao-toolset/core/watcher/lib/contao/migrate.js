const dockerstats = require("dockerstats");
var exec = require("child_process").exec;
//const util = require('util');
//const exec = util.promisify(require('child_process').exec);


const {
  watch
} = require("gulp");
const {
  verify_foldername
} = require("../../../../core/verify/verify");


var isWatcherActive_migrate = true;

module.exports = {
  migrate: async function () {
    return new Promise(async function (resolve, reject) {
      try {
        const data = await dockerstats.dockerContainers();
        await module.exports.get_container_by_name(data);
      } catch (e) {
        console.log(e);
      }
    });
  },
  get_container_by_name: async function (data) {
    return new Promise(async function (resolve, reject) {
      var watch_path_bundles_dca = [
        "src/**/Resources/contao/dca/*.php",
        "src/Lupcom/**/Resources/contao/dca/*.php",
      ];
      const watcher = watch(watch_path_bundles_dca);
      watcher.on("change", async function (path, stats) {
        if (!isWatcherActive_migrate) {
          // If the watcher is paused, skip the processing
          return;
        }
        isWatcherActive_migrate = false;

        for (const container of data) {
          if (Object.values(container).includes("dev-env_php-fpm73")) {
            console.log(
              "migrate-auto".info,
              `- ${path} automigration executed`.warn
            );
            await module.exports.automigrate_dryrun();
            await module.exports.automigrate();
            isWatcherActive_migrate = true;
            resolve(true);
          }
        }
      });
      //console.log(container.name);
      //console.log(container.id);

    });
  },
  automigrate: async function () {
    return new Promise(async function (resolve, reject) {

      try {
        let contao_info_json = require("../../../contao-info.json");
        let project_php_version = contao_info_json.php_version;

        let folername = await verify_foldername();

          let fpm_version = 'php-fpm74_1' // default

          if (project_php_version == "7.3") {
            fpm_version = 'php-fpm73_1'
          }
          if (project_php_version == "7.4") {
            fpm_version = 'php-fpm74_1'
          }
          if (project_php_version == "8.1") {
            fpm_version = 'php-fpm81_1'
          }
          if (project_php_version == "8.2") {
            fpm_version = 'php-fpm82_1'
          }

          console.log(`🧙 docker exec dev-env_${fpm_version} sh -c "cd ${folername.basename} && vendor/bin/contao-console contao:migrate --schema-only --no-interaction && /bin/sh"`.brightCyan)
          exec(
            `docker exec dev-env_${fpm_version} sh -c "cd ${folername.basename} && vendor/bin/contao-console contao:migrate --schema-only --no-interaction && /bin/sh"`,
            function (err, stdout, stderr) {
              //console.log('stdout:', stdout)
            }
          );
        resolve(true);

      } catch (error) {

      }
    });
  },

  /* 
  * Shows pending migrations and schema updates without actually executing them.
  */
  automigrate_dryrun: async function () {
    return new Promise(async function (resolve, reject) {

      try {
        let contao_info_json = require("../../../contao-info.json");
        let project_php_version = contao_info_json.php_version;

        let folername = await verify_foldername();

          let fpm_version = 'php-fpm74_1' // default

          if (project_php_version == "7.3") {
            fpm_version = 'php-fpm73_1'
          }
          if (project_php_version == "7.4") {
            fpm_version = 'php-fpm74_1'
          }
          if (project_php_version == "8.1") {
            fpm_version = 'php-fpm81_1'
          }
          if (project_php_version == "8.2") {
            fpm_version = 'php-fpm82_1'
          }

          console.log(`🧙 docker exec dev-env_${fpm_version} sh -c "cd ${folername.basename} && vendor/bin/contao-console contao:migrate --dry-run && /bin/sh"`.brightCyan)
          exec(
            `docker exec dev-env_${fpm_version} sh -c "cd ${folername.basename} && vendor/bin/contao-console contao:migrate --dry-run && /bin/sh"`,
            function (err, stdout, stderr) {
              //console.log('pending_migrations:'.brightCyan, stdout)
              resolve(stdout);
            }
          );
      

      } catch (error) {

      }
    });
  },
};