const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs-extra");
const {
  ora_loading_default_start,
  ora_loading_default_stop,
} = require("../../../core/console/console");

module.exports = {
  contao_toolset: async function (foldername) {
    try {
      await fs.ensureDir("contao-toolset/apps/project-app/latest_toolset/");
    } catch (err) {
      console.error(err);
    }

    let download_success = await module.exports.download_contao_toolset();
    if (download_success) {
      await module.exports.move_contao_toolset_files_into_project(foldername);
      console.log("\n");
      await module.exports.npm_install(foldername.value);
      console.log("\n");
      await module.exports.cleanup();
      return true;
    } else {
      return false;
    }
  },

  download_contao_toolset: async function () {
    return new Promise(async function (resolve, reject) {
      let spinner = await ora_loading_default_start("Download Contao Toolset");
      exec(
        `git clone git@gitlab.lupcom.de:dev-env/entwicklungsumgebung-steffen/contao-toolset.git`,
        {
          cwd: "contao-toolset/apps/project-app/latest_toolset/",
        }
      )
        .then(async () => {
          await ora_loading_default_stop(
            spinner,
            "Download Contao Toolset abgeschlossen"
          );
          console.log("\n");

          resolve(true);
        })
        .catch((err) => {
          console.error(err);
          resolve(false);
        });
    });
  },

  move_contao_toolset_files_into_project: async function (foldername) {
    try {
      await fs.copy(
        "contao-toolset/apps/project-app/latest_toolset/contao-toolset/",
        `contao-toolset/apps/project-app/output/${foldername.value}`
      );

      console.log(
        " move_contao_toolset_files_into_project ".bgWhite.black +
          ` OK `.black.dim
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  cleanup: async function () {
    try {
      await fs.remove(
        "contao-toolset/apps/project-app/latest_toolset/contao-toolset"
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  npm_install: async function (foldername) {
    let spinner = await ora_loading_default_start("npm install gestartet");
    /*     console.log("===================================".brightCyan);
    console.log("           Composer Update         ".brightCyan);
    console.log("===================================".brightCyan); */
    const { stdout, stderr } = await exec(`npm i`, {
      cwd: `contao-toolset/apps/project-app/output/${foldername}`,
    });
    await ora_loading_default_stop(spinner, "npm install abgeschlossen");
    return true;
  },
};
