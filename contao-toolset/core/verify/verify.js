const fs = require("fs-extra");
var exec = require("child_process").exec;
const dockerstats = require("dockerstats");
var hostile = require("hostile");
const os = require("os");
const { current_dev_env } = require("../setup/environment");
const {
  parse_nginx_conf,
  foldername_found_in_nginx_config,
} = require("../setup/nginx");
const credentials = require("../../credentials.json");
const mysql = require("mysql2");
const { Client } = require("ssh2");

module.exports = {
  verify_core: async function () {
    return new Promise(async function (resolve, reject) {
      let gitlab_connection = await module.exports.verify_gitlab_connection();
      let local_dev_environment = await module.exports.verify_dev_environment();
      let hosts_entry = await module.exports.verify_hosts_entry();
      let nginx_entry = await module.exports.verify_nginx_entry();
      let contao_src_folder = await module.exports.verify_contao_src_folder();
      var foldername = await module.exports.verify_foldername();
      var folderpath = await module.exports.verify_folder_path();
      var gitlab_ci = await module.exports.verify_gitlab_ci();
      var composer_phar = await module.exports.verify_composer_phar();
      var ssh = await module.exports.verify_ssh();
      var db = await module.exports.verify_db();

      try {
        var contao_info = await module.exports.load_contao_info();
        //console.log("contao_info:", contao_info);
      } catch (error) {}

      if (contao_info) {
        console.log(
          ` PHP: ${contao_info.php_version} , Contao: ${contao_info.contao_version}   `
            .bgYellow.black
        );
      }
      //console.log(" ⚒ PROJECT STATE ⚒ ".yellow.dim);
      //console.log("===================".yellow.dim);
      console.log("\n");
      let response = {
        gitlab_connection: gitlab_connection,
        local_dev_environment: local_dev_environment.env_exists,
        hosts_entry: hosts_entry,
        folderpath: folderpath,
        contao_src_folder: contao_src_folder,
        local_dev_environment: local_dev_environment,
      };

      if (contao_src_folder) {
        console.log(" ✔ ".bgBlue + " " + " contao_src_folder ".white);
      } else {
        console.log("❌   contao_src_folder ".yellow.dim);
      }
      if (gitlab_connection) {
        console.log(" ✔ ".bgBlue + " " + " gitlab_connection ".white);
      } else {
        console.log("❌   gitlab_connection ".yellow.dim);
      }
      if (local_dev_environment.env_exists) {
        console.log(" ✔ ".bgBlue + " " + " docker_environment ".white);
      } else {
        console.log("❌   docker_environment ".yellow.dim);
      }
      if (foldername.verified) {
        console.log(" ✔ ".bgBlue + " " + " foldername (.loc) ".white);
      } else {
        console.log("❌   foldername (.loc) ".yellow.dim);
      }
      if (folderpath) {
        console.log(" ✔ ".bgBlue + " " + " folderpath (/application) ".white);
      } else {
        console.log("❌   folderpath (/application) ".yellow.dim);
      }
      if (hosts_entry) {
        console.log(" ✔ ".bgBlue + " " + " hosts_entry ".white);
      } else {
        console.log("❌   hosts_entry ".yellow.dim);
      }
      if (nginx_entry) {
        console.log(" ✔ ".bgBlue + " " + " nginx_entry ".white);
      } else {
        console.log("❌   nginx_entry ".yellow.dim);
      }
      if (gitlab_ci) {
        console.log(" ✔ ".bgBlue + " " + " gitlab_ci ".white);
      } else {
        console.log("❌   gitlab_ci ".yellow.dim);
      }
      if (composer_phar) {
        console.log(" ✔ ".bgBlue + " " + " composer_phar ".white);
      } else {
        console.log("❌   composer_phar ".yellow.dim);
      }
      if (ssh) {
        console.log(" ✔ ".bgBlue + " " + " ssh-remote-con".white);
      } else {
        console.log("❌   ssh-remote-con ".yellow.dim);
      }
      if (db) {
        console.log(" ✔ ".bgBlue + " " + " db-remote-con".white);
      } else {
        console.log("❌   db-remote-con ".yellow.dim);
      }
      //console.log("===================".yellow.dim);
      console.log("\n");

      resolve(response);
    });
  },
  verify_gitlab_connection: async function () {
    return new Promise(async function (resolve, reject) {
      exec(`ssh -T git@gitlab.lupcom.de`, function (err, stdout, stderr) {
        //console.log('stdout:', stdout);
        if (stdout.includes("Welcome to GitLab")) {
          resolve(true);
        } else {
          console.log(
            "Kein SSH Zugriff. Du benötigst SSH Keys für gitlab.lupcom.de "
          );
          resolve(false);
        }
      });
    });
  },
  
  verify_ext_requirements: async function () {
    /* composer depends ext-gd */
  },
  verify_platform_requirements: async function () {
    /* composer check-platform-reqs */
    // check if there is a fail included !!!!!
    try {
      const util = require("util");
      const exec = util.promisify(require("child_process").exec);

      let contao_info_json = require("../../../contao-info.json");
      let project_php_version = contao_info_json.php_version;
      let folername = await module.exports.verify_foldername();

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

      
      const {stdout ,stderr} = await exec(`docker exec dev-env_${fpm_version} sh -c "cd ${folername.basename} && php composer.phar check-platform-reqs && /bin/sh"`);
      if (stderr && stderr.includes("Checking platform requirements for packages in the vendor dir") == false) {
        console.log(
          " verify_platform_requirements ".bgCyan.black +
          ` ${stderr} `.red
        );
        return "error"
      } else {
        const lines = stdout.split('\n');
        const result = [];
  
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
  
          if (parts.length >= 3) {
            const name = parts[0];
            const version = parts[1];
            const success = parts[2];
  
            result.push({
              name,
              version,
              success,
            });
          }
        }

      const hasNonSuccessValue = result.some((item) => item.success !== 'success');
      return hasNonSuccessValue;

      }

    
    } catch (error) {
      console.log(
        " verify_platform_requirements ".bgCyan.black +
        ` ${error.stdout} `.red
      );      
    }

    return "error"

  },
  verify_node_version: async function () {
    /* check node version to ensure version 14+ is used (sftp needs it) */
  },
  verify_php_requirements: async function () {
    /* composer depends php */
   /* list what php version a package requires */
  },
  verify_openai_access: async function () {},
  verify_tpl_scss_folderconvention: async function () {

    const css_path = await fs.pathExists("files/tpl/css")
    const scss_path = await fs.pathExists("files/tpl/scss")
    const nested_scss_path = await fs.pathExists("files/tpl/css/scss")

    if (css_path && nested_scss_path) {
      return 1 // ivo
    }else if(css_path && scss_path){
      return 2 // lupcom
    }else{
      return false
    }
  },
  verify_bundles_scss_folderconvention: async function () {
    const css_path = await fs.pathExists("src/CustomElementsBundle/Resources/public/css")
    const scss_path = await fs.pathExists("src/CustomElementsBundle/Resources/public/scss")
    const nested_scss_path = await fs.pathExists("src/CustomElementsBundle/Resources/public/css/scss")

    if (css_path && nested_scss_path) {
      return 1 // ivo
    }else if(css_path && scss_path){
      return 2 // lupcom
    }else{
      return false
    }
  },
  /*
   * Testing if Container includes / matches the default one
   */
  verify_dev_environment: async function (data) {
    return new Promise(async function (resolve, reject) {
      const data = await dockerstats.dockerContainers();

      for (const container of data) {
        if (Object.values(container).includes("dev-env_php-fpm73")) {
          resolve({
            env_exists: true,
            php: "7.3",
          });
        }
      }
      resolve({
        env_exists: false,
      });
    });
  },
  verify_hosts_entry: async function () {
    return new Promise(async function (resolve, reject) {
      // If `preserveFormatting` is true, then include comments, blank lines and other
      // non-host entries in the result
      var preserveFormatting = false;

      let match = hostile.get(preserveFormatting, function (err, lines) {
        if (err) {
          console.error(err.message);
        }
        let path = require("path");
        let basename = path.resolve(__dirname, "..", "..", "..");
        basename = path.basename(basename);

        lines.forEach(function (line) {
          //console.log(line); // [IP, Host]

          if (line[1] == basename) {
            resolve(true);
          }
        });
        resolve(false);
      });
    });
  },
  verify_nginx_entry: async function (dev_env) {
    return new Promise(async function (resolve, reject) {
      let dev_env = await current_dev_env();
      if (dev_env.includes("dev-env")) {
        nginx_conf = await parse_nginx_conf();

        if (nginx_conf) {
          let server_entry_exists = await foldername_found_in_nginx_config(
            nginx_conf
          );
          resolve(server_entry_exists.value); // true or false
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  },
  verify_ssl_certificate: async function () {
    return new Promise(async function (resolve, reject) {});
  },
  verify_foldername: async function () {
    return new Promise(async function (resolve, reject) {
      let path = require("path");
      let basename = path.resolve(__dirname, "..", "..", "..");
      basename = path.basename(basename);
      //console.log("verify_folder".verbose,basename);
      if (basename.includes(".loc")) {
        resolve({
          verified: true,
          basename: basename,
        });
      } else {
        resolve({
          verified: false,
          basename: basename,
        });
      }
    });
  },
  verify_gitlab_ci: async function () {
    return new Promise(async function (resolve, reject) {
      const exists = await fs.pathExists(".gitlab-ci.yml");
      resolve(exists);
    });
  },
  verify_contao_info_json: async function () {
    return new Promise(async function (resolve, reject) {
      const exists = await fs.pathExists("contao-info.json");
      resolve(exists);
    });
  },
  verify_composer_phar: async function () {
    return new Promise(async function (resolve, reject) {
      const exists = await fs.pathExists("composer.phar");
      resolve(exists);
    });
  },
  verify_folder_path: async function () {
    return new Promise(function (resolve, reject) {
      let path = require("path");
      let basename = path.resolve(__dirname, "..", "..", "..", "..");
      basename = path.basename(basename);
      if (basename == "application") {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  verify_contao_src_folder: async function () {
    return new Promise(async function (resolve, reject) {
      const exists = await fs.pathExists("./src");
      resolve(exists);
    });
  },
  verify_dev_env: async function () {
    return new Promise(async function (resolve, reject) {
      const userHomeDir = os.homedir();
      const exists = await fs.pathExists(userHomeDir + "/www/dev-env");
      resolve(exists);
    });
  },
  get_php_version_list_array: async function () {
    return new Promise(function (resolve, reject) {
      exec(
        "ls",
        {
          cwd: "/etc/php",
        },
        function (err, stdout, stderr) {
          let phpversionlist_arr = stdout
            .toString()
            .split("\n")
            .filter((n) => n);
          //console.log('installed php versions:', phpversionlist_arr)

          resolve(stdout.toString());
        }
      );
    });
  },

  verify_php_73: async function () {
    return new Promise(async function (resolve, reject) {
      let versionlist = await module.exports.get_php_version_list_array();
      if (versionlist.includes("7.3")) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  verify_php_74: async function () {
    return new Promise(async function (resolve, reject) {
      let versionlist = await module.exports.get_php_version_list_array();
      if (versionlist.includes("7.4")) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  verify_php_81: async function () {
    return new Promise(async function (resolve, reject) {
      let versionlist = await module.exports.get_php_version_list_array();
      if (versionlist.includes("8.1")) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  verify_php_82: async function () {
    return new Promise(async function (resolve, reject) {
      let versionlist = await module.exports.get_php_version_list_array();
      if (versionlist.includes("8.2")) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },

  verify_ssh: async function () {
    return new Promise(async function (resolve, reject) {
      try {
        const conn = new Client();
        conn
          .on("error", () => {
            resolve(false);
            conn.end();
          })
          .on("ready", () => {
            resolve(true);
            conn.end();
          })
          .connect({
            host: credentials.SSH_HOST,
            port: credentials.PORT,
            username: credentials.SSH_USERNAME,
            password: credentials.SSH_PASSWORD,
          });
      } catch (error) {}
    });
  },

  verify_db: async function () {
    return new Promise(async function (resolve, reject) {
      const sshClient = new Client();
      const dbServer = {
        host: credentials.DB_HOST,
        port: 3306,
        user: credentials.DB_USERNAME,
        password: credentials.DB_PASSWORD,
        //database: credentials.DB_DATABASE,
      };
      const tunnelConfig = {
        host: credentials.SSH_HOST,
        port: credentials.PORT,
        username: credentials.SSH_USERNAME,
        password: credentials.SSH_PASSWORD,
      };
      const forwardConfig = {
        srcHost: "127.0.0.1",
        srcPort: 3306,
        dstHost: dbServer.host,
        dstPort: dbServer.port,
      };

      sshClient
        .on("ready", () => {
          // Connection hopping
          sshClient.forwardOut(
            forwardConfig.srcHost,
            forwardConfig.srcPort,
            forwardConfig.dstHost,
            forwardConfig.dstPort,
            (err, stream) => {
              if (err) reject(err);
              const updatedDbServer = {
                ...dbServer,
                stream,
              };
              const connection = mysql.createConnection(updatedDbServer);
              connection.connect((error) => {
                if (error) {
                  resolve(false);
                } else {
                  resolve(true);
                  connection.end();
                }
              });
            }
          );
        })
        .on("error", () => {
          resolve(false);
          try {
            conn.end();
          } catch (error) {
            //console.log("Connection Error - Please Check Credentials");
          }
        })
        .connect(tunnelConfig);
    });
  },

  load_contao_info: async function () {
    return new Promise(async function (resolve, reject) {
      try {
        const json = await fs.readJson("contao-info.json", { throws: false });

        resolve(json);
      } catch (error) {
        resolve();
      }
    });
  },
};
