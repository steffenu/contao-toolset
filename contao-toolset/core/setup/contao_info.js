const fs = require("fs-extra");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const {
  verify_contao_info_json
} = require("../verify/verify");
const {
  prompt_phpversion
} = require("../console/console");

/*
 * php version info for the project.
 */

module.exports = {
  contao_info: async function () {
    return new Promise(async function (resolve, reject) {
      await module.exports.get_php_version();
      await module.exports.get_contao_version();
      resolve(true);
    });
  },
  get_php_version: async function () {
    return new Promise(async function (resolve, reject) {
      let contao_info_json_exists = await verify_contao_info_json();
      //console.log("contao_info_json_exists:", contao_info_json_exists);

      if (contao_info_json_exists == false) {
        let phpversion = await prompt_phpversion();
        //console.log("phpversion:", phpversion);
        //console.log(phpversion["Entwicklungsumgebung"][0]);
        if (phpversion["Entwicklungsumgebung"][0]) {
          try {
            await fs.ensureFile("contao-info.json");
            const jsonString = {
              "php_version": "", // set by script
              "contao_version": "", // set by script
              "fpm_image": "", // set by script
              "php-ext": [], // set by script
              "preset_db": "", // set by script
              "browsersync": 1, //  (open project in browser - livereload)
              "puppeteer": 1, //  (open project in browser  and more- livereload)
              //"puppeteer_extras": 1, //  (open project in browser  and more- livereload)
              "scss_folder_compile_mode": "2", //  0 = tmv , 1 = ivo  , 2 = lupcom 
              "prettier_html": 2, 
              "prettier_scss": 2,  
              "prettier_js": 2,  
              "lint": 1,  
              "compile_mode": 2,
              "compile_ts": 2,
              "compile_scss": 2, 
              "compile_scss_bem": 1, 
              "fileheaders": 1, 
              //"fileheaders_status": 1, 
              "clear_cache": 2, //  - (page , script , image)
              "composer_install": 2, //  - composer install on dca change
              "migrate": 2, //  - migrate on dca changes
            };
 
            try {
              await fs.writeJson("contao-info.json", jsonString, {
                spaces: 2
              });
            
            } catch (err) {
              console.error("Error writing to file",err)
            }

/*             fs.writeFileSync("contao-info.json", jsonString, "utf8", (err) => {
              if (err) {
                console.error("Error writing to file:", err);
              } else {
                console.log("JSON data written to file successfully.");
              }
            }); */
          } catch (err) {
            console.error(err);
          }

          let contao_info = require("./../../../contao-info.json");
          //console.log("contao_info:", contao_info);

          await module.exports.writeJson_phpversion(
            contao_info,
            phpversion["Entwicklungsumgebung"][0]
          );
        }
      } else {
        let contao_info = require("../../../contao-info.json");
        //console.log("contao_info:", contao_info);
        resolve(contao_info.php_version);
      }
      resolve(true);
    });
  },
  get_contao_version: async function () {
    return new Promise(async function (resolve, reject) {
      try {
        const {
          stdout,
          stderr
        } = await exec(`vendor/bin/contao-console -V`, {
          silent: true,
        });
        if (stderr) {
          console.log("Fehler beim ausführen von exec".bgYellow.black);
        } else if (stdout) {
          //console.log("TEST", stdout);
          let contao_version = await module.exports.parse_contao_version_string(
            stdout
          );
          let contao_info = require("./../../../contao-info.json");
          //console.log("contao_info:", contao_info);
          await module.exports.writeJson_contaoversion(
            contao_info,
            contao_version
          );
        }
      } catch (error) {
        console.log(
          " contao_info ".bgWhite.black +
          " Keine Contao Installation gefunden ".bgYellow.black
        );
      }

      resolve(true);
    });
  },
  parse_contao_version_string: async function (stdout) {
    return new Promise(async function (resolve, reject) {
      const regex = /\d+(?:\.\d+){2}/; //  "Contao Managed Edition 4.13.25 (env: prod, debug: false) #StandWithUkraine https://sf.to/ukraine";
      const match = stdout.match(regex);
      resolve(match[0]); // Output: 4.13.25
    });
  },

  writeJson_phpversion: async function (contao_info, phpversion) {
    try {
      contao_info["php_version"] = phpversion;
      let updated_json = contao_info;

      await fs.writeJson("contao-info.json", updated_json,{
        spaces: 2
      });
    } catch (err) {
      console.error(err);
    }
  },
  writeJson_contaoversion: async function (contao_info, contaoversion) {
    try {
      contao_info["contao_version"] = contaoversion;
      let updated_json = contao_info;

      await fs.writeJson("contao-info.json", updated_json , {
        spaces: 2
      });
    } catch (err) {
      console.error(err);
    }
  },
};