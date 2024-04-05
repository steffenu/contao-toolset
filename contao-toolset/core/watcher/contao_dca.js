const {
  watch
} = require("gulp");

const {autocomposer_container} = require("./lib/contao/composer-install")
const {automigrate} = require("./lib/contao/migrate");
const settings = require("../../../contao-info.json");

let lock = false;
module.exports = {
  contao_dca: async function () {
    var watch_path_bundles_dca = [
      "src/**/Resources/contao/dca/*.php",
      "src/Lupcom/**/Resources/contao/dca/*.php",
    ];
    const watcher = watch(watch_path_bundles_dca);
    watcher.on("change", async function (path, stats) {
      if (lock) {return;}
      lock = true;
      if (settings.composer_install == 2) {await autocomposer_containe()}     
      if (settings.composer_install == 2 && settings.migrate == 2) { await automigrate()}     


    
      lock = false;
    });
    
  },

}