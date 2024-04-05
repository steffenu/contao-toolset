const fs = require("fs-extra");

var ConfigParser = require("@webantic/nginx-config-parser");
var parser = new ConfigParser();
const os = require("os");
const userHomeDir = os.homedir();
const { current_root_foldername } = require("./environment");
const { prompt_toggle, prompt_select } = require("../prompts/prompts");
const { current_dev_env } = require("./environment");

const { cert } = require("./cert");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const {
  ora_loading_default_start,
  ora_loading_default_stop,
} = require("../../core/console/console");

module.exports = {
  /* 
  This function manages the whole process. It first verifies the folder path, parses the Nginx configuration, checks if the folder name is present in the Nginx config, and if not, prompts the user if they want to add it. If the user agrees, it adds the server to the config, writes the updated configuration back to the file, outputs a success message, and finally rebuilds the Docker container.
  */
  nginx: async function () {
    return new Promise(async function (resolve, reject) {
      const { verify_folder_path } = require("../verify/verify");

      let check_folderpath = await verify_folder_path();
      if (check_folderpath == false) {
        resolve(false);
        return;
      }

      let nginx_conf = await module.exports.parse_nginx_conf();

      let foldername_found =
        await module.exports.foldername_found_in_nginx_config(nginx_conf);

      if (foldername_found["value"] == false) {
        let prompt = await prompt_toggle(
          `Nginx Config`.verbose +
            " - Server nicht gefunden . Eintrag " +
            ` ${foldername_found.foldername}`.success +
            " hinzufügen ?"
        );

        if (prompt.value) {
          let conf = await module.exports.nginx_add_server(
            nginx_conf,
            foldername_found.foldername
          );
          await module.exports.write_nginx_conf(conf);
          console.log(
            "Nginx Server " +
              `${foldername_found.foldername}`.verbose +
              " Added".success
          );
          let rebuild_container = await module.exports.rebuild_container();
          resolve(true);
        } else {
          resolve(false);
        }
      }
      resolve(true);
    });
  },
  parse_nginx_conf: async function () {
    return new Promise(async function (resolve, reject) {
      let dev_env = await current_dev_env();
      try {
        var config = await parser.readConfigFile(
          `${dev_env}/build/config/default.conf`,
          {
            parseIncludes: false,
          }
        );

        //console.log(` Entwicklungsumgebung  - ${dev_env} `.bgWhite.black);
        resolve(config);
      } catch (error) {
        console.log(`${dev_env}/build/config/default.conf`.red);
        resolve(false);
      }
    });
  },
  write_nginx_conf: async function (nginx_config) {
    return new Promise(async function (resolve, reject) {
      let dev_env = await current_dev_env();

      if (dev_env.includes("dev-env")) {
        try {
          const exists = await fs.pathExists(
            `${dev_env}/build/config/default.conf`
          );

          if (exists == false) {
            try {
              await fs.outputFile(`${dev_env}/build/config/default.conf`, "");
            } catch (err) {
              console.error(err);
            }
          }

          parser.writeConfigFile(
            `${dev_env}/build/config/default.conf`, // OVERWRITING ORIGINAL
            nginx_config,
            true
          );

          resolve(nginx_config);
        } catch (error) {
          console.log("error:", error);
        }
      } else {
        console.log(
          "❌ Entwicklungsumgebung nicht gefunden , stelle sicher das   das Projekt im Ordner volumes/application liegt "
            .red
        );
      }
    });
  },
  nginx_add_server: async function (nginx_config, foldername) {
    return new Promise(async function (resolve, reject) {
      let select_fpm = await prompt_select(
        "Welche PHP-FPM Version ?",
        (choices = [
          {
            title: "PHP-FPM73",
            value: "fpm73",
          },
          {
            title: "PHP-FPM74",
            value: "fpm74",
          },
          {
            title: "PHP-FPM81",
            value: "fpm81",
          },
        ])
      );

      let prompt = await prompt_toggle(`SSL Zertifikat hinzufügen für HTTPS ?`);

      const exists = await fs.pathExists(`web`);
      if (exists) {
        var publicdir = "web";
      } else {
        var publicdir = "public";
      }

      let server = {
        listen: "8080",
        server_name: foldername,
        root: `/var/www/${foldername}/${publicdir}`,
        include: `${select_fpm.value}.conf`,
      };

      if (prompt.value) {
        await cert();
        server = {
          listen: "443 ssl",
          server_name: foldername,
          root: `/var/www/${foldername}/${publicdir}`,
          include: `${select_fpm.value}.conf`,

          ssl_certificate: `/etc/nginx/certs/${foldername}.pem`,
          ssl_certificate_key: `/etc/nginx/certs/${foldername}-key.pem`,
        };
      }

      nginx_config["server"].push(server);

      resolve(nginx_config);
    });
  },

  foldername_found_in_nginx_config: async function (nginx_conf) {
    return new Promise(async function (resolve, reject) {
      let path = require("path");
      let basename = await current_root_foldername(); // returns path
      basename = path.basename(basename); // returns foldername

      let match = false;
      for (const server of nginx_conf["server"]) {
        if (server.server_name.includes(basename)) {
          match = true;
        }
      }
      if (match) {
        resolve({
          value: true,
          foldername: basename,
        });
      } else {
        resolve({
          value: false,
          foldername: basename,
        });
      }
    });
  },
  rebuild_container: async function () {
    return new Promise(async function (resolve, reject) {
      let spinner = await ora_loading_default_start(
        "Rebuilding Docker Container"
      );

      const { stdout, stderr } = await exec(
        `docker-compose stop && docker-compose build && docker-compose up -d`,
        {
          cwd: userHomeDir + "/www/dev-env/",
        }
      );
      await ora_loading_default_stop(
        spinner,
        "Rebuilding Docker Container erfolgreich"
      );
      resolve(true);
    });
  },
};
