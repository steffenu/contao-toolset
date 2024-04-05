const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs-extra");
const {
  ora_loading_default_start,
  ora_loading_default_stop,
} = require("../../../core/console/console");

module.exports = {
  gitignore: async function (foldername) {
    let success = await module.exports.move_default_gitignore_into_project(
      foldername
    );
    return success;
  },

  move_default_gitignore_into_project: async function (foldername) {
    try {
      await fs.copy(
        "contao-toolset/apps/project-app/gitignore",
        `contao-toolset/apps/project-app/output/${foldername.value}/.gitignore`
      );

      console.log(
        " move_default_gitignore_into_project ".bgWhite.black + ` OK `.black.dim
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};
