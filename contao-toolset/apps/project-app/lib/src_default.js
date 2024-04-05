const fs = require("fs-extra");

module.exports = {
  src_default: async function (foldername) {
    let add_tpl_success = await module.exports.add_src_default(foldername);
    return add_tpl_success;
  },

  add_src_default: async function (foldername) {
    try {
      await fs.copy(
        "contao-toolset/apps/project-app/src/",
        `contao-toolset/apps/project-app/output/${foldername.value}/src`
      );
      console.log(" add_src_default ".bgWhite.black + ` OK `.black.dim);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};
