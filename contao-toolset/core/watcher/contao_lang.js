const {
  watch
} = require("gulp");
const {autocomposer_container} = require("./lib/contao/composer-install")

let lock = false;
module.exports = {
  contao_lang: async function () {
    var watch_path_bundles_dca = [
      "src/**/Resources/contao/languages/**/*.php",
      "src/Lupcom/**/Resources/languages/**/*.php",
    ];
    const watcher = watch(watch_path_bundles_dca);
    watcher.on("change", async function (path, stats) {
      if (lock) {return;}
      lock = true;
      await autocomposer_container();
      lock = false;
    });
  },
}