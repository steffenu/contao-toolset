const fs = require("fs-extra");
module.exports = {
  composer_phar: async function (foldername) {
    return new Promise(async function (resolve, reject) {
      let add_composer_phar = await module.exports.add_composer_phar(
        foldername
      );
      resolve(add_composer_phar);
    });
  },
  add_composer_phar: async function (foldername) {
    return new Promise(async function (resolve, reject) {
      try {
        await fs.copy(
          "contao-toolset/apps/project-app/composer.phar",
          "contao-toolset/apps/project-app/output/" +
            foldername.value +
            "/composer.phar"
        );
        console.log(" add_composer_phar ".bgWhite.black + ` OK `.black.dim);
        resolve(true);
      } catch (err) {
        resolve(false);
        console.error(err);
      }
    });
  },
};
