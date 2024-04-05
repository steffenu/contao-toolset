const {
  watch
} = require("gulp");
const {
  prettier_html
} = require("./lib/prettier/html");
const {
  purgePageCache,
  purgeImageCache,
  purgeScriptCache
} = require("./lib/contao/clear-cache");
const {
  puppeteer_reload
} = require("./lib/puppeteer/reload/puppeteer");
const settings = require("../../../contao-info.json");
const {lint_html} = require("./lib/lint/html")
const {bem_html_to_scss} = require("./lib/bem_html_to_scss/bem_html_to_scss")

let lock = false;
module.exports = {
  html: async function (browserSync = false) {
    const watch_path_html = ["src/**/Resources/contao/templates/*.html5", "templates/*.html5"];
    var watcher = watch(watch_path_html, {
      delay: 1000
    });
    watcher.on("change", async function (path, stats) {
      if (lock) {return;}
      lock = true;
      if (settings.clear_cache == 2) {      
        await purgeImageCache();
        await purgePageCache();
        await purgeScriptCache();
      }
      if (settings.prettier_html == 2) {await prettier_html(path)}
      await bem_html_to_scss(path);     
      if (settings.puppeteer == 2) {await puppeteer_reload()}     
      if (settings.browsersync == 2) {
        if (browserSync) {
          browserSync.reload()
        }}
        if (settings.lint == 2) {
          await lint_html(path);
        }
           
      lock = false;
    });
  }
}


/*  CHATGPT DEBUGGING HELP
Initial Trigger (Twice):
When you first change a file that matches the patterns defined in watch_path_html, the watch task's change event is fired twice. This is because the watch event is triggered for both the change to the file itself and the change to the stats (file metadata) of the file. The watch event is asynchronous, and since your prettier_html function is also asynchronous, it can be called twice in quick succession due to the initial double event.

Subsequent Triggers (Once):
After the initial double trigger, the watch task functions normally and only triggers once on each file change. This is likely because the initial asynchronous events have settled, and subsequent events are handled properly.

Solution = added delay to not allow super quick double triggering
*/