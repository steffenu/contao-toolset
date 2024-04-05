const {
  watch
} = require("gulp");
const settings = require("../../../contao-info.json");
const {compile,compile_lupcom,compile_bundles_legacy,compile_files_legacy} = require("./lib/scss/util")
const {prettier_scss} = require("./lib/prettier/scss")
const {
  puppeteer_reload
} = require("./lib/puppeteer/reload/puppeteer");

const {
  purgePageCache,
  purgeImageCache,
  purgeScriptCache
} = require("./lib/contao/clear-cache");
const {lint_scss} = require("./lib/lint/scss")

let lock = false;
module.exports = {
  scss: async function (browserSync) {

    /* All scss files are in /scss folder */
    if (settings.compile_mode == 2) {
      var watch_path_bundles = [
        "src/**/Resources/public/scss/*.scss",
      ];

      var watch_path_files = [
        "files/tpl/scss/*.scss",
      ];
    }     

    /*  scss partials /scss folder , main scss files are in /css */
    if (settings.compile_mode == 1) {
      var watch_path_bundles = [
        "src/**/Resources/public/css/scss/*.scss",
        "src/**/Resources/public/css/*.scss",
      ];

      var watch_path_files = [
        "files/tpl/css/scss/*.scss",
        "files/tpl/css/*.scss",
      ];
    }     

    /* tmv mode ... currently not supported */
    if (settings.compile_mode == 0) {
      var watch_paths_files = [
        "files/templates/css/scss/**/*.scss",
        "files/templates/css/*.scss",
      ];
  
      var watch_path_bundles = [
        "src/**/Resources/public/styles/scss/*.scss",
        "src/**/Resources/public/styles/**/*.scss",
      ];
    }    

    const watch_paths = [
      ...watch_path_bundles,
      ...watch_path_files
    ];

    const watcher = watch(watch_paths, {
      delay: 1000
    });

    watcher.on("change", async function (path, stats) {
      if (lock) {return;}
      lock = true;
      if (settings.compile_mode == 2) {
        if (settings.clear_cache == 2) {      
          await purgeImageCache();
          await purgePageCache();
          await purgeScriptCache();
        }
        if (settings.compile_scss == 2) {await compile_lupcom(path)}     
        if (settings.prettier_scss == 2) {await prettier_scss(path)} 
        if (settings.puppeteer == 2) {await puppeteer_reload()}     
        if (settings.browsersync == 2) {
          if (browserSync) {
            browserSync.reload()
          }}    
      }     
      if (settings.compile_mode == 1) {
        if (settings.clear_cache == 2) {      
          await purgeImageCache();
          await purgePageCache();
          await purgeScriptCache();
        }

        if (settings.compile_scss == 2) {await compile(path)}     
        if (settings.prettier_scss == 2) {await prettier_scss(path)}     
        if (settings.puppeteer == 2) {await puppeteer_reload()}     
        if (settings.browsersync == 2) {
          if (browserSync) {
            browserSync.reload()
          }}    
      }     
      if (settings.compile_mode == 0) {
        /* currently not supported */
        if (settings.browsersync == 2) {
          if (browserSync) {
            browserSync.reload()
          }}    
      }
      if (settings.lint == 2) {
        await lint_scss(path);   
      }
      
      lock = false;
    });
  }
}


