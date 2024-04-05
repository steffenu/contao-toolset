var gulp = require("gulp");
const prettier = require("gulp-prettier");
const config = require("./configs/scss.json");

module.exports = {
  prettier_scss: async function (path) {
    return new Promise(async function (resolve, reject) {
      gulp
        .src(path, {
          base: "./"
        })
        .pipe(prettier(config))
        .on("error", (err) => {
          console.error(err.toString());
          this.emit('end');
          resolve(false)
        })
        .pipe(gulp.dest("./"))
        .on("end", () => {
          console.log(
            "prettier-scss".info.bgMagenta,
            `- ${path}`.yellow.dim
          );
          resolve(true)
        });
    });
  },
};