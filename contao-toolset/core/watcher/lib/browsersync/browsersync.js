const { watch } = require("gulp");
const credentials = require("../../../../credentials.json");
var browserSync = require("browser-sync").create();

module.exports = {
  browsersync: async function (foldername) {
     module.exports.browsersync_start(foldername);
     return browserSync
    
  },
  browsersync_start: async function (foldername) {
    return new Promise(async function (resolve, reject) {
      var watch_path_templates = "templates/*.html5";
      var watch_path_files = "files/templates/css/scss/**/*.scss";
      var watch_path_bundles_styles =
        "src/**/Resources/public/styles/scss/**/*.scss";
      var watch_path_bundles_styles_tpl = [
        "src/**/Resources/public/css/scss/*.scss",
        "src/**/Resources/public/css/*.scss",
      ];
      var watch_path_bundles_templates =
        "src/**/Resources/contao/templates/*.html5";
      var watch_path_bundles_javascript = "src/**/Resources/public/js/*.js";

      let watch_path_bundles_lupcom = [
        "src/Lupcom/**/Resources/public/**/scss/**/*.scss",
        "src/Lupcom/**/Resources/public/css/scss/*.scss",
        "src/Lupcom/**/Resources/public/css/*.scss",
        "src/Lupcom/**/Resources/contao/templates/*.html5",
        "src/Lupcom/**/Resources/public/js/*.js",
      ];

      var watch_path_bundles_dca = [
        "src/**/Resources/contao/dca/*.php",
        "src/Lupcom/**/Resources/contao/dca/*.php",
      ];

      var watch_path_files_tpl = [
        "files/tpl/css/*.scss",
        "files/tpl/css/scss/*.scss",
      ];

      var watchpaths_arr = [
        watch_path_templates,
        ...watch_path_bundles_lupcom,
        ...watch_path_files_tpl,
        ...watch_path_bundles_styles_tpl,
        ...watch_path_bundles_dca,
        watch_path_files,
        watch_path_bundles_styles,
        watch_path_bundles_templates,
        watch_path_bundles_javascript,
      ];


      if (credentials.PROTOCOL == "https://") {
        console.log(foldername);
        browserSync.init({
          https: {
            key: "contao-toolset/certs/localhost-key.pem",
            cert: "contao-toolset/certs/localhost.pem",
          },
         
          proxy: credentials.PROTOCOL + foldername,
          /* files: watchpaths_arr, */

          logLevel: "silent",
          //_browser: ["google chrome", "firefox"],

          // use /preview.php/ path to prevent caching ;)
          startPath: credentials.BROWSERSYNC_ENTRYPOINT,
          middleware: [
            function (req, res, next) {
              //console.log('req:', req['headers']['referer'])
              next();
            },
          ],
        });
        console.log(
          " Toolset ".bgMagenta.black + " waiting for filechanges ".black.dim
        );
        

      } else {
        browserSync.init({
          logLevel: "silent",
          proxy: foldername,
          /* files: watchpaths_arr, */
          //_browser: ["google chrome", "firefox"],

          // use /preview.php/ path to prevent caching ;)
          startPath: credentials.BROWSERSYNC_ENTRYPOINT,
          middleware: [
            function (req, res, next) {
              //console.log('req:', req['headers']['referer'])
              next();
            },
          ],
        });
        console.log(
          " Toolset ".bgYellow.black + " waiting for filechanges ".black.dim
        );
      }

/*       const watcher = watch(watchpaths_arr);

      watcher.on("change", async function (path, stats) {
        //console.log(`browsersync_auto - File ${path} was changed`);
        let cache_clear_and_reload_succes = await pp_clear_cache_and_reload();
        if (cache_clear_and_reload_succes == false) {
          browserSync.reload;
        }
      }); */
    });
  },
};
