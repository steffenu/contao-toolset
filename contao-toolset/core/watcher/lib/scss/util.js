const { watch, src, dest, series } = require("gulp");
const fs = require("fs-extra");
var autoprefixer = require("autoprefixer");
const sass = require("gulp-sass")(require("sass"));
var postcss = require("gulp-postcss");
var glob = require("glob");
let path = require("path");

module.exports = {
  compile: async function (path) {
    return new Promise(async function (resolve, reject) {
      let basename = await module.exports.basename(path);

      let is_partial = await module.exports.is_partial(basename);

      let req_path = require("path");
      let lvl1 = req_path.dirname(path);
      let lvl2 = req_path.dirname(lvl1);

      if (is_partial) {
        await module.exports.main(path, lvl2); // is_partial -> compile all main files in /css
      } else {
        console.log(
          "scss_bundles_auto".info.bgYellow,
          `- ${path} compiled`.verbose
        );
        module.exports.output_css(path, lvl1); // is_main -> compile main
      }

      resolve(true);
    });
  },
  compile_lupcom: async function (path) {
    return new Promise(async function (resolve, reject) {
      let basename = await module.exports.basename(path);

      let is_partial = await module.exports.is_partial(basename);
      let req_path = require("path");
      let lvl1 = req_path.dirname(path);
      let lvl2 = req_path.dirname(lvl1); // public
      lvl2 = lvl2 + "/css"
    

      if (is_partial) {
        await module.exports.main_lupcom(path, lvl1); // is_partial -> compile all main files in scss
      } else {
        console.log(
          "scss_bundles_auto".info.bgYellow,
          `- ${path} compiled`.verbose
        );
        module.exports.output_css(path, lvl2); // is_main -> compile main to /css folder
      }

      resolve(true);
    });
  },
  compile_files_legacy: async function (path) {
    return new Promise(async function (resolve, reject) {
      let req_path = require("path");
      let lvl1 = req_path.dirname(path);
      let lvl2 = req_path.dirname(lvl1);
      let lvl3 = req_path.dirname(lvl2);

      if (lvl1 == "files/templates/css/scss/components") {
        var glob_statement = lvl3 + "/" + "*.scss";
        let results = glob.sync(glob_statement);

        for (const file of results) {
          let filecheck = file;

          console.log(
            "scss_files_auto - legacy".info,
            `- ${filecheck} was compiled`.verbose
          );
          module.exports.output_css(filecheck, lvl3);
        }
      } else {
        let css_folder_path = lvl2 + "/css";

        if (css_folder_path == "files/templates/css") {
          module.exports.output_css(path, css_folder_path);
          console.log("scss_files_auto".info, `- ${path} was compiled`.verbose);
        } else if (css_folder_path == "files/templates/css/css") {
          console.log("scss_files_auto".info, `- ${path} was compiled`.verbose);
          module.exports.output_css(path, lvl2);
        }
      }
      resolve(true);
    });
  },
  compile_bundles_legacy: async function (path) {
    return new Promise(async function (resolve, reject) {
      let req_path = require("path");
      let lvl1 = req_path.dirname(path);
      let lvl2 = req_path.dirname(lvl1);
      let lvl3 = req_path.dirname(lvl2);

      let is_partial = module.exports.determine_lvl(path);
      console.log("is_partial:", is_partial);
      const regex = /_.*\.scss/g; // partial syntax

      if (is_partial && regex.test(path)) {
        let css_folder_path = lvl3 + "/css";
        console.log("css_folder_path:", css_folder_path);

        let exist = await module.exports.path_exists(css_folder_path); // true false clg
        console.log("exist:", exist);
        if (exist) {
          var glob_statement = lvl2 + "/" + "*.scss";

          let results = glob.sync(glob_statement);

          for (const file of results) {
            let filecheck = file;

            let css_folder_path_partials = lvl3 + "/css";

            console.log(
              "scss_bundles_auto - legacy".info.bgYellow,
              `- ${path} was compiled`.verbose
            );
            module.exports.output_css(filecheck, css_folder_path_partials);
          }
        }
      } else {
        let css_folder_path = lvl2 + "/css";

        let exist = await module.exports.path_exists(css_folder_path);

        if (exist) {
          module.exports.output_css(path, css_folder_path);
          console.log(
            "scss_bundles_auto".info.bgYellow,
            `- ${path} was compiled`.verbose
          );
        }
      }
      resolve(true);
    });
  },
  is_partial: async function (path) {
 
    return new Promise(async function (resolve, reject) {
      const regex = /^_/;
      resolve(regex.test(path));
    });
  },
  basename: async function (path_) {
    return new Promise(async function (resolve, reject) {
      let basename = path.resolve(path_);
      basename = path.basename(basename);
      resolve(basename);
    });
  },
  output_css: function (inputpath, ouputpath) {
    var plugins = [
      autoprefixer({
        overrideBrowserslist: ["last 2 version"],
      }),
    ];

    return src(inputpath, {
      sourcemaps: false,
    })
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss(plugins))
      .pipe(
        dest(ouputpath, {
          sourcemaps: ".",
        })
      );
  },
  main: async function (path, lvl2) {
    return new Promise(async function (resolve, reject) {
      var glob_statement = lvl2 + "/" + "*.scss";
      let results = glob.sync(glob_statement);

      for (const file of results) {
        let filecheck = file;
        console.log(
          "scss_bundles_auto".info.bgYellow,
          `- ${file} compiled`.brightCyan
        );
        module.exports.output_css(filecheck, lvl2);
      }
      resolve(true);
    });
  },
  main_lupcom: async function (path, lvl2) {
    return new Promise(async function (resolve, reject) {
      var glob_statement = lvl2 + "/" + "!(_)*.scss"; // every scss not starting with underscore (main files)
      let results = glob.sync(glob_statement);
      //console.log('results:', results)
 
      let req_path = require("path");
      let lvl3 = req_path.dirname(path);
      let lvl4 = req_path.dirname(lvl3);
      lvl4 = lvl4 + "/css"


      for (const file of results) {
        let filecheck = file;
        console.log(
          "scss_bundles_auto".info.bgYellow,
          `- ${file} compiled`.brightCyan
        );
        module.exports.output_css(filecheck, lvl4);
      }
      resolve(true);
    });
  },
  determine_lvl: function (path) {
    let req_path = require("path");
    let lvl1 = req_path.dirname(path);

    if (
      lvl1.includes("css/scss/components") ||
      lvl1.includes("styles/scss/components") ||
      lvl1.includes("styles/scss/partials") ||
      lvl1.includes("public/css/scss")
    ) {
      return true;
    } else {
      return false;
    }
  },
  path_exists: async function (f) {
    const exists = await fs.pathExists(f);
    //console.log("Path: " + f, exists); // => false
    return exists;
  },
};

