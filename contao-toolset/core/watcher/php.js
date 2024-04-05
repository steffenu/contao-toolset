const {
  watch
} = require("gulp");
const {
  reload_page
} = require("./lib/puppeteer/reload/puppeteer");

let lock = false;
module.exports = {
  html: async function () {
    const watch_path_html = ["src/**/Resources/contao/templates/*.html5", "templates/*.html5"];
    var watcher = watch(watch_path_html, {
      delay: 1000
    });
    watcher.on("change", async function (path, stats) {
      if (lock) {return;}
      lock = true;
      /* currently no functionality for php */
      await reload_page();
      lock = false;
    });
  }
}