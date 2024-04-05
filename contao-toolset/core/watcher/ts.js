const {
  watch,
} = require("gulp");
const {compile_ts} = require("./lib/ts/ts")
const settings = require("../../../contao-info.json");


let lock = false;
module.exports = {
  ts: async function () {
    return new Promise(async function (resolve, reject) {

      var watch_paths_ts = [
        "src/CustomElementsBundle/Resources/public/ts/*.ts",
        "files/tpl/ts/*.ts"
      ];

      const watcher = watch(watch_paths_ts);
      watcher.on("change", async function (path, stats) {
        if (lock) {return;}
        lock = true;
        if (settings.compile_ts == 2) {await compile_ts(path)} 
        lock = false;

      });
    });
  },
};