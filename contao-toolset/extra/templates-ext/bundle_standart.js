const gulp = require("gulp");
const replace = require("gulp-replace");
var rename = require("gulp-rename");
const fs = require("fs-extra");
const cheerio = require("cheerio");

const { abfrage_ja_nein } = require("../../core/prompts/prompts");
const { prompt_text } = require("../../core/prompts/prompts");

/*
 * Generate Controller , Template ,   Append Language and DCA Imports all via a single prompt !
 */

module.exports = {
  bundle_standart: async function () {
    return new Promise(async function (resolve, reject) {
      let bundlename = await module.exports._1_create_bundlefolder();
      await module.exports._2_create_subfolder_DependencyInjection(bundlename);
      await module.exports._2_1_generate_file_Extension(bundlename);
      await module.exports._3_create_subfolder_Resources(bundlename);
      await module.exports._4_create_subfolder_config(bundlename);
      await module.exports._4_1_generate_file_services(bundlename);
      await module.exports._5_create_subfolder_contao(bundlename);
      await module.exports._5_1_create_subfolder_config(bundlename);
      await module.exports._5_2_generate_file_config(bundlename);
      await module.exports._5_3_create_subfolder_dca(bundlename);
      //await module.exports._5_4_generate_file_category_table(bundlename);
      await module.exports._5_5_generate_file_table(bundlename);
      await module.exports._5_6_generate_file_tl_content(bundlename);
      await module.exports._6_create_subfolder_languages_de(bundlename);
      await module.exports._6_1_generate_file_modules(bundlename);
      //await module.exports._6_2_generate_file_category_table(bundlename);
      await module.exports._6_3_generate_file_table(bundlename);
      await module.exports._6_4_generate_file_tl_content(bundlename);
      await module.exports._7_create_subfolder_Model(bundlename);
      await module.exports._7_1_generate_file_model(bundlename);
      await module.exports._8_generate_file_bundle(bundlename);

      resolve();
    });
  },

  _1_create_bundlefolder: async function () {
    return new Promise(async function (resolve, reject) {
      let bundlename = await prompt_text(
        "Bundle Namen eingeben (z.B Input = Regionen , Output = RegionenBundle)"
      );
      bundlename = bundlename.value;

      try {
        await fs.ensureDir("src/" + bundlename + "Bundle");
        console.log("success!");
        resolve(bundlename);
      } catch (err) {
        console.error(err);
        reject();
      }
    });
  },
  _2_create_subfolder_DependencyInjection: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      try {
        await fs.ensureDir(
          "src/" + bundlename + "Bundle" + "/DependencyInjection"
        );
        console.log("success!");
        resolve();
      } catch (err) {
        console.error(err);
        reject();
      }
    });
  },
  _2_1_generate_file_Extension: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      gulp
        .src(
          "contao-toolset/extra/templates-ext/templates/AngeboteBundle/DependencyInjection/AngeboteExtension.php"
        )
        .pipe(replace("##NAME_BUNDLE##", bundlename))
        .pipe(rename(`${bundlename}Extension.php`))
        .pipe(
          gulp.dest("src/" + bundlename + "Bundle" + "/DependencyInjection")
        );

      resolve();
    });
  },
  _3_create_subfolder_Resources: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      try {
        await fs.ensureDir("src/" + bundlename + "Bundle" + "/Resources");
        console.log("success!");
        resolve();
      } catch (err) {
        console.error(err);
        reject();
      }
    });
  },
  _4_create_subfolder_config: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      try {
        await fs.ensureDir(
          "src/" + bundlename + "Bundle" + "/Resources" + "/config"
        );
        console.log("success!");
        resolve();
      } catch (err) {
        console.error(err);
        reject();
      }
    });
  },

  _4_1_generate_file_services: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      gulp
        .src(
          "contao-toolset/extra/templates-ext/templates/AngeboteBundle/Resources/config/services.yml"
        )
        .pipe(replace("##NAME_BUNDLE##", bundlename))
        .pipe(
          gulp.dest("src/" + bundlename + "Bundle" + "/Resources" + "/config")
        );

      resolve();
    });
  },

  _5_create_subfolder_contao: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      try {
        await fs.ensureDir(
          "src/" + bundlename + "Bundle" + "/Resources" + "/contao/"
        );
        console.log("success!");
        resolve();
      } catch (err) {
        console.error(err);
        reject();
      }
    });
  },
  _5_1_create_subfolder_config: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      try {
        await fs.ensureDir(
          "src/" + bundlename + "Bundle" + "/Resources" + "/contao/config"
        );
        console.log("success!");
        resolve();
      } catch (err) {
        console.error(err);
        reject();
      }
    });
  },

  _5_2_generate_file_config: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      gulp
        .src(
          "contao-toolset/extra/templates-ext/templates/AngeboteBundle/Resources/contao/config/config.php"
        )
        .pipe(replace("##NAME_TABLE##", bundlename.toLowerCase()))
        .pipe(replace("##NAME_BUNDLE##", bundlename))
        .pipe(
          gulp.dest(
            "src/" + bundlename + "Bundle" + "/Resources" + "/contao/config"
          )
        );

      resolve();
    });
  },

  _5_3_create_subfolder_dca: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      try {
        await fs.ensureDir(
          "src/" + bundlename + "Bundle" + "/Resources" + "/contao/dca"
        );
        console.log("success!");
        resolve();
      } catch (err) {
        console.error(err);
        reject();
      }
    });
  },

  /*   _5_4_generate_file_category_table: async function (bundlename) {

    return new Promise(async function (resolve, reject) {

      gulp.src('contao-toolset/extra/templates-ext/templates/AngeboteBundle/Resources/contao/languages/de/tl_region.php') 
      .pipe(replace('##NAME_TABLE##',bundlename.toLowerCase())) 
      .pipe(gulp.dest("src/" + bundlename + "Bundle" + "/Resources" +  "/contao/dca")); 
    
      resolve(); 
    });
  }, */
  _5_5_generate_file_table: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      gulp
        .src(
          "contao-toolset/extra/templates-ext/templates/AngeboteBundle/Resources/contao/dca/tl_angebote.php"
        )
        .pipe(replace("##NAME_TABLE##", bundlename.toLowerCase()))
        .pipe(rename(`tl_${bundlename.toLowerCase()}.php`))
        .pipe(
          gulp.dest(
            "src/" + bundlename + "Bundle" + "/Resources" + "/contao/dca"
          )
        );

      resolve();
    });
  },
  _5_6_generate_file_tl_content: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      gulp
        .src(
          "contao-toolset/extra/templates-ext/templates/AngeboteBundle/Resources/contao/dca/tl_content.php"
        )
        .pipe(
          gulp.dest(
            "src/" + bundlename + "Bundle" + "/Resources" + "/contao/dca"
          )
        );

      resolve();
    });
  },

  _6_create_subfolder_languages_de: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      try {
        await fs.ensureDir(
          "src/" +
            bundlename +
            "Bundle" +
            "/Resources" +
            "/contao" +
            "/languages/de"
        );
        console.log("success!");
        resolve();
      } catch (err) {
        console.error(err);
        reject();
      }
    });
  },

  _6_1_generate_file_modules: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      gulp
        .src(
          "contao-toolset/extra/templates-ext/templates/AngeboteBundle/Resources/contao/languages/de/modules.php"
        )
        .pipe(replace("##NAME_TABLE##", bundlename.toLowerCase()))
        .pipe(replace("##NAME_BUNDLE##", bundlename))
        .pipe(
          gulp.dest(
            "src/" +
              bundlename +
              "Bundle" +
              "/Resources" +
              "/contao" +
              "/languages/de"
          )
        );

      resolve();
    });
  },

  /*   _6_2_generate_file_category_table: async function (bundlename) {

    return new Promise(async function (resolve, reject) {

      gulp.src('contao-toolset/extra/templates-ext/templates/RegionBundle/Resources/contao/languages/de/tl_region_category.php') 
      .pipe(replace('##NAME_TABLE##',bundlename.toLowerCase())) 
      .pipe(gulp.dest("src/" + bundlename + "Bundle" + "/Resources" + "/contao" + "/languages/de")); 
    
      resolve(); 
    });
  }, */

  _6_3_generate_file_table: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      gulp
        .src(
          "contao-toolset/extra/templates-ext/templates/AngeboteBundle/Resources/contao/languages/de/tl_angebote.php"
        )
        .pipe(replace("##NAME_TABLE##", bundlename.toLowerCase()))
        .pipe(rename(`tl_${bundlename.toLowerCase()}.php`))
        .pipe(
          gulp.dest(
            "src/" +
              bundlename +
              "Bundle" +
              "/Resources" +
              "/contao" +
              "/languages/de"
          )
        );

      resolve();
    });
  },
  _6_4_generate_file_tl_content: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      gulp
        .src(
          "contao-toolset/extra/templates-ext/templates/AngeboteBundle/Resources/contao/languages/de/tl_content.php"
        )
        .pipe(
          gulp.dest(
            "src/" +
              bundlename +
              "Bundle" +
              "/Resources" +
              "/contao" +
              "/languages/de"
          )
        );

      resolve();
    });
  },

  _7_create_subfolder_Model: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      try {
        await fs.ensureDir("src/" + bundlename + "Bundle" + "/Model");
        console.log("success!");
        resolve();
      } catch (err) {
        console.error(err);
        reject();
      }
    });
  },

  _7_1_generate_file_model: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      gulp
        .src(
          "contao-toolset/extra/templates-ext/templates/AngeboteBundle/Model/AngeboteModel.php"
        )
        .pipe(replace("##NAME_TABLE##", bundlename.toLowerCase()))
        .pipe(replace("##NAME_BUNDLE##", bundlename))
        .pipe(rename(`${bundlename}Model.php`))
        .pipe(gulp.dest("src/" + bundlename + "Bundle" + "/Model"));

      resolve();
    });
  },

  _8_generate_file_bundle: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      gulp
        .src(
          "contao-toolset/extra/templates-ext/templates/AngeboteBundle/AngeboteBundle.php"
        )
        .pipe(replace("##NAME_BUNDLE##", bundlename))
        .pipe(rename(`${bundlename}Bundle.php`))
        .pipe(gulp.dest("src/" + bundlename + "Bundle"));

      resolve();
    });
  },
};
