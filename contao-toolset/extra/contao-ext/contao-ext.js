const fs = require("fs-extra");
const {
  get_php_version,
  compare_php_version,
} = require("../../core/php-versioncheck/php-versioncheck");
const {
  php_versionswitch_ext,
} = require("../php-versionswitch-ext/php-versionswitch-ext");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { verify_composer_phar } = require("../../core/verify/verify");
const {
  parse_nginx_conf,
  foldername_found_in_nginx_config,
} = require("../../core/setup/nginx");
const {
  ora_loading_default_start,
  ora_loading_default_stop,
} = require("../../core/console/console");

module.exports = {
  install_old: async function () {
    await module.exports.compare_switch_php();
    try {
      const { stdout, stderr } = await exec("composer install");
      console.log("✅ composer install completed");
    } catch (error) {
      console.log("error:", `${error}`.red);
      console.log("❌ composer install failed with active php Version".error);
    }
    return true;
  },

  install: async function () {
    let spinner = await ora_loading_default_start("Composer Install gestartet");
    let composer_phar_exists = await verify_composer_phar();
    if (composer_phar_exists) {
      let nginx_conf = await parse_nginx_conf();
      if (nginx_conf) {
        let server_entry_exists = await foldername_found_in_nginx_config(
          nginx_conf
        );
        for (const server of nginx_conf.server) {
          if (server.server_name == server_entry_exists.foldername) {
            let fpm_version = server.include.split(".")[0];
            const { stdout, stderr } = await exec(
              `docker exec dev-env_php-${fpm_version}_1 sh -c "cd ${server_entry_exists.foldername} && php composer.phar install"`
            );
            console.log(
              `FPM DOCKER CONTAINER: ${fpm_version}`.brightCyan,
              `${stdout}`.info
            );
            await ora_loading_default_stop(
              spinner,
              "Composer install abeschlossen"
            );
            return true;
          }
        }
      }
    } else {
      console.log(
        "Install nicht möglich - Bitte composer.phar in das Projekt beilegen und Docker Container neustarten"
          .warn
      );
    }
    return false;
  },

  update_old: async function () {
    await module.exports.compare_switch_php();
    try {
      const { stdout, stderr } = await exec("composer update");
      console.log("✅ composer update completed");
    } catch (error) {
      console.log("error:", `${error}`.red);
      console.log("❌ composer update failed with active php Version".error);
    }
    return true;
  },

  update: async function () {
    let spinner = await ora_loading_default_start("Composer Update gestartet");

    let composer_phar_exists = await verify_composer_phar();
    if (composer_phar_exists) {
      let nginx_conf = await parse_nginx_conf();
      if (nginx_conf) {
        let server_entry_exists = await foldername_found_in_nginx_config(
          nginx_conf
        );
        for (const server of nginx_conf.server) {
          if (server.server_name == server_entry_exists.foldername) {
            let fpm_version = server.include.split(".")[0];
            await exec(
              `docker exec dev-env_php-${fpm_version}_1 sh -c "cd ${server_entry_exists.foldername} && php composer.phar update"`,
              async function (err, stdout, stderr) {
                console.log("stdout:", stdout);
                await ora_loading_default_stop(
                  spinner,
                  "Composer Update abeschlossen"
                );
                return true;
              }
            );
          }
        }
      }
    } else {
      console.log(
        "Update nicht möglich - Bitte composer.phar in das Projekt beilegen und Docker Container neustarten"
          .warn
      );
    }
    return false;
  },

  compare_switch_php: async function () {
    const project_php_version = await fs.readFile(contao_toolset_conf, "utf8");
    let local_active_php_version = await get_php_version();
    let check = await compare_php_version(
      JSON.parse(project_php_version)["php_version"],
      local_active_php_version
    );
    if (!check) {
      await php_versionswitch_ext();
      return false;
    }
    return true;
  },
};
