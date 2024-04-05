var gulp = require('gulp');
const {
  src,
  dest,
  watch
} = require('gulp');
const prettier = require('gulp-prettier');
const config = require("./configs/php.json");
const {
  fileheader
} = require("./fileheader")

/* CURRENTLY NOT USING PHP PRETTIER */

isWatcherActive_php = true;
module.exports = {
  php: async function () {
    console.log("ran")
    var watch_path_bundles_dca = [
      "src/**/Resources/contao/dca/*.php",
      "src/Lupcom/**/Resources/contao/dca/*.php",
    ];

    const watcher = watch(watch_path_bundles_dca);
    watcher.on("change", async function (path, stats) {

      if (!isWatcherActive_php) {
        // If the watcher is paused, skip the processing
        return;
      }
      await fileheader(path);
      isWatcherActive_php = true;

      /*         return gulp
              .src(path)
              .pipe(prettier(config))
              .pipe(gulp.dest("./"))
              .on("error", (err) => {
                console.error(err.toString());
              })
              .on("end", () => {
                isWatcherActive_php = true;
                console.log(
                  "prettier-php".info.bgMagenta,
                  `- ${path}`.yellow.dim
                );
              });  */
    });
  },
};