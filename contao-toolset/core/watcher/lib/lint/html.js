const gulp = require('gulp');
const htmlhint = require('gulp-htmlhint');


module.exports = {

  lint_html: async function (path) {
    return new Promise(async function (resolve, reject) {

      const htmlhintOptions = {
        "alt-require": true,
        "script-disabled": true,
        "style-disabled": true,
        "attr-lowercase": false,
        "attr-no-duplication": false,
        "attr-no-unnecessary-whitespace": false,
        "attr-unsafe-chars": false,
        "attr-value-double-quotes": false,
        "attr-value-not-empty": false,
        "doctype-first": false,
        "doctype-html5": false,
        "head-script-disabled": false,
        "href-abs-or-rel": false,
        "id-class-ad-disabled": false,
        "id-class-value": false,
        "id-unique": false,
        "inline-script-disabled": false,
        "inline-style-disabled": false,
        "space-tab-mixed-disabled": false,
        "spec-char-escape": false,
        "src-not-empty": false,
        "tag-pair": false,
        "tag-self-close": false,
        "tagname-lowercase": false,
        "title-require": false,
        // Add more rules or customize them based on your needs
      };

      gulp
        .src(path) // Change the file pattern as needed
        .pipe(htmlhint(htmlhintOptions))
        .pipe(htmlhint.reporter())
        .pipe(htmlhint.failAfterError())
        .on("error", (err) => {
          console.error(err.toString());
          
          resolve(false)
        })
        .on("end", () => {
          console.log(
            "lint-html".info.bgMagenta,
            `- ${path}`.yellow.dim
          );
          resolve(true)
        });
    });
  }
}