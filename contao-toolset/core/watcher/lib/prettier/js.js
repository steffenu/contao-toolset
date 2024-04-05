var gulp = require("gulp");
const prettier = require("gulp-prettier");
const config = require("./configs/js.json");


var isWatcherActive_js = true;
module.exports = {
  prettier_js: async function (path) {
    return new Promise(function (resolve, reject) {
      gulp
        .src(path, {
          base: "./"
        })
        .pipe(prettier(config))
        .on("error", (err) => {
          isWatcherActive_js = true;
          console.error(err.toString());
          this.emit('end'); // End the current task and to prevent whole script from exiting
          resolve(false) // stop at this point
        })
        .pipe(gulp.dest("./"))
        .on("end", async () => {
          isWatcherActive_js = true;
          console.log(
            " prettier-js ".info.bgMagenta,
            `- ${path}`.yellow.dim
          );
          resolve(true)
        });
    });
  },
};