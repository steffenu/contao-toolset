const fs = require("fs-extra");

module.exports = {
  config: async function (foldername) {
    let add_config_success = await module.exports.add_config(foldername);
    return add_config_success;
  },

  add_config: async function (foldername) {
    try {
      await fs.copy(
        "contao-toolset/apps/project-app/config/config.yml",
        `contao-toolset/apps/project-app/output/${foldername.value}/config/config.yml`
      );
      console.log(" add_config ".bgWhite.black + ` OK `.black.dim);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};
