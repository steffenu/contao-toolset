const {
  watch
} = require("gulp");
const {
  prettier_js
} = require("./lib/prettier/js");
const {
  fileheader
} = require("./lib/prettier/fileheader");
const {
  puppeteer_reload
} = require("./lib/puppeteer/reload/puppeteer");
const settings = require("../../../contao-info.json");

const {
  purgePageCache,
  purgeImageCache,
  purgeScriptCache
} = require("./lib/contao/clear-cache");
const {
  lint_js
} = require("./lib/lint/js")
const {
  openai_comment,
  openai_ask,
  openai_readme
} = require("./lib/openai/tags")

let lock = false;
module.exports = {
  js: async function (browserSync) {

    var watch_path_js = ["src/**/Resources/public/js/*.js"];
    var watcher = watch(watch_path_js, {
      delay: 1000
    });

    watcher.on("change", async function (path, stats) {
      if (lock) {
        return;
      }
      lock = true;
      if (settings.clear_cache == 2) {
        await purgeImageCache();
        await purgePageCache();
        await purgeScriptCache();
      }
      if (settings.prettier_js == 2) {
        await prettier_js(path);
      }
      if (settings.fileheaders == 2) {
        await fileheader(path);
      }
      if (settings.puppeteer == 2) {
        await puppeteer_reload()
      }
      if (settings.browsersync == 2) {
        if (browserSync) {
          browserSync.reload()
        }
      }
      if (settings.lint == 2) {
        await lint_js(path);
      }


      await openai_comment(path);
      await openai_readme(path);
      await openai_ask(path);
      lock = false;
    });
  }
}

/* 
This JavaScript file defines a gulp task that watches for changes in JavaScript files located in a specific path. When a change in the JavaScript files is detected, depending on certain settings defined in the contao-info.json file, the script can perform a series of actions including purging various caches, running a code formatting utility (Prettier), adding file headers, reloading a Puppeteer instance, reloading a BrowserSync instance, and linting the changed JavaScript file using a linter.

In essence, this gulp task is designed to automatically trigger a series of quality control processes whenever changes are made to the JavaScript files in a project, improving the development workflow by automating routine tasks.
*/