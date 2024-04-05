const gulp = require("gulp");
const credentials = require("../../credentials.json");
const replace = require("gulp-replace");

module.exports = {
  gitlab_ci: async function (input) {
    return new Promise(async function (resolve, reject) {
      if (!credentials.SSH_USERNAME) {
        console.log(
          "Bitte".error +
            " SSH_USERNAME ".brightCyan +
            "in der credentials.json eintragen !".error
        );
        resolve(false);
        return;
      }
      gulp
        .src("contao-toolset/extra/demo_domain/.gitlab-ci.yml")
        .pipe(replace("##SSH_USERNAME##", credentials.SSH_USERNAME)) // c1_headerbild
        .pipe(gulp.dest(`./`))
        .on("end", () => {
          resolve();
          console.log(
            " demo_domain ".bgWhite.black +
              " gitlab-ci.yml wurde generiert ".black.dim
          );
        })
        .on("error", reject);
    });
  },
};
