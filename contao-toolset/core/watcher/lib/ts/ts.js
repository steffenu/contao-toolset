var ts = require('gulp-typescript');
const path_lib = require('path');
var gulp = require('gulp');

module.exports = {
  compile_ts: async function (path) {

    const dirname = path_lib.dirname(path) // same path
    let dirname_lv2 = path_lib.dirname(dirname) // same path
    dirname_lv2 = dirname_lv2 + "/js" // same path

    gulp.src(path)
      .pipe(ts({
        noImplicitAny: true,

      }))
      .on('error', (err) => {
        console.error(err.toString());
      })
      .pipe(gulp.dest(dirname_lv2))
      .on('end', (err) => {
        console.log(
          " ts ".bgBlue.black +
          ` ${path}`.cyan
        );
      })
  },
}