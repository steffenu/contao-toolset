const fs = require("fs-extra");

module.exports = {
  templates: async function (foldername) {
    let success = await module.exports.add_templates(foldername);
    return success;
  },

  add_templates: async function (foldername) {
    try {
      await fs.copy(
        "contao-toolset/apps/project-app/templates",
        `contao-toolset/apps/project-app/output/${foldername.value}/templates`
      );
      console.log(" add_templates ".bgWhite.black + ` OK `.black.dim);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};
