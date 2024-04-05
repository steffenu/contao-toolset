const fs = require("fs-extra");

module.exports = {
  tpl_folderstructure: async function (foldername) {
    let add_tpl_success = await module.exports.add_tpl_folderstructure(
      foldername
    );
    return add_tpl_success;
  },

  add_tpl_folderstructure: async function (foldername) {
    try {
      await fs.copy(
        "contao-toolset/apps/project-app/files/",
        `contao-toolset/apps/project-app/output/${foldername.value}/files`
      );
      console.log(" add_tpl_folderstructure ".bgWhite.black + ` OK `.black.dim);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};
