const gulp = require("gulp");
const replace = require("gulp-replace");
var rename = require("gulp-rename");
const fs = require("fs-extra");
const cheerio = require("cheerio");

const { abfrage_ja_nein } = require("../../core/prompts/prompts");
const { prompt_text } = require("../../core/prompts/prompts");

const { bundle_categories } = require("./bundle_categories");
const { bundle_standart } = require("./bundle_standart");

/*
 * Generate Controller , Template ,   Append Language and DCA Imports all via a single prompt !
 */

module.exports = {
  templates_ext: async function () {
    return new Promise(async function (resolve, reject) {
      let choose_option = await abfrage_ja_nein("Bitte Wählen:", [
        "Inhaltselement",
        "Bundle nur Datensätze",
        "Bundle mit Kategorien + Datensätze",
      ]);

      if (choose_option["selected"] == "Inhaltselement") {
        await module.exports.contentelement();
      }

      if (choose_option["selected"] == "Bundle nur Datensätze") {
        await bundle_standart();
      }

      if (choose_option["selected"] == "Bundle mit Kategorien + Datensätze") {
        await bundle_categories();
      }

      resolve();
    });
  },

  contentelement: async function () {
    return new Promise(async function (resolve, reject) {
      let bundlename = await module.exports.select_bundle();
      let controllername = await module.exports.generate_controller(bundlename);

      await module.exports.generate_template(controllername);
      await module.exports.generate_bem_scss(
        controllername.prefix.toLowerCase() +
          "_" +
          controllername.controllername_lowercase
      );
      await module.exports.add_controller_dca(controllername, bundlename);
      await module.exports.add_controller_languages(controllername, bundlename);
      await module.exports.move_output(controllername, bundlename);

      resolve(true);
    });
  },
  select_bundle: async function () {
    let bundles = await module.exports.bundles_list();
    let selected_bundle = await abfrage_ja_nein(
      "In welches Bundle möchtest du das neue Inhaltselement einfügen?".warn,
      bundles
    );
    let bundlename = selected_bundle["selected"];
    if (bundlename != "CustomElementsBundle") {
      console.log(
        "Tipp:😎 ".green +
          "Stelle sich das der Controller in services.yml geladen wird im "
            .green +
          `${bundlename}`.brightCyan
      );
    }
    return bundlename;
  },
  generate_controller: async function (bundlename) {
    return new Promise(async function (resolve, reject) {
      let controllername = await prompt_text(
        "Controller Namen eingeben (z.B HeaderBild)"
      );
      controllername = controllername.value;
      let prefix = await prompt_text("Prefix / Nummerierung (z.B C1)");
      prefix = prefix.value;

      gulp
        .src(
          "contao-toolset/extra/templates-ext/templates/Controller/ContentElement/Controller.php"
        )
        .pipe(replace("##NAME_CONTROLLER##", prefix + "_" + controllername)) // C1_Headerbild
        .pipe(replace("##NAME_BUNDLE##", bundlename)) // C1_Headerbild
        .pipe(
          replace(
            "##NAME_TEMPLATE##",
            prefix.toLowerCase() + "_" + controllername.toLowerCase()
          )
        )
        .pipe(
          replace(
            "##TYPE##",
            prefix.toLowerCase() + "_" + controllername.toLowerCase()
          )
        ) // c1_headerbild
        .pipe(replace("##BACKENDNAME##", controllername))
        .pipe(rename(`${prefix}_${controllername}Controller.php`)) // C1_HeaderbildController.php
        .pipe(gulp.dest(`contao-toolset/extra/templates-ext/ouptut/`));

      resolve({
        name: controllername,
        controllername: prefix + "_" + controllername,
        controllername_lowercase: controllername.toLowerCase(),
        prefix: prefix,
        prefix_lowercase: prefix.toLowerCase(),
      });
    });
  },
  generate_template: async function (input) {
    return new Promise(async function (resolve, reject) {
      gulp
        .src(
          "contao-toolset/extra/templates-ext/templates/Resources/contao/templates/template.html5"
        )
        .pipe(replace("##NAME_TEMPLATE##", input.controllername_lowercase)) // c1_headerbild
        .pipe(
          rename(
            input.prefix.toLowerCase() +
              "_" +
              input.controllername_lowercase +
              ".html5"
          )
        ) // c1_headerbild.html5
        .pipe(gulp.dest(`contao-toolset/extra/templates-ext/ouptut/`))
        .on("end", resolve)
        .on("error", reject);
    });
  },
  generate_bem_scss: async function (templatename) {
    return new Promise(async function (resolve, reject) {
      function parseHTML(html) {
        const $ = cheerio.load(html);
        const classes = new Set();

        $("[class]").each(function () {
          const classList = $(this).attr("class").split(" ");
          classList.forEach((className) => {
            if (className.includes("__") || className.includes("--")) {
              classes.add(className);
            }
          });
        });

        return Array.from(classes);
      }

      function generateSCSS(classes) {
        let scss = "";
        let nestedElements = {};

        classes.forEach((className) => {
          const [block, element, modifier] = className.split(/__|--/);

          if (element && !modifier) {
            if (!nestedElements[block]) {
              nestedElements[block] = [];
            }
            nestedElements[block].push(element);
          }
        });

        for (const [block, elements] of Object.entries(nestedElements)) {
          scss += `.${block} {\n`;
          elements.forEach((element) => {
            scss += `  &__${element} {\n    \n  }\n`;
          });
          scss += "}\n\n";
        }
        return scss;
      }

      // generated html ouptut path
      const htmlFilePath = `contao-toolset/extra/templates-ext/ouptut/${templatename}.html5`;

      // Read HTML file
      let file = fs.readFile(htmlFilePath, "utf8", (err, html) => {
        //console.log('html:', html)
        if (err) {
          console.error(err);
          return;
        }

        const parsedClasses = parseHTML(html);
        const scssOutput = generateSCSS(parsedClasses);

        // Writing the SCSS output to a file
        fs.writeFileSync(
          `contao-toolset/extra/templates-ext/ouptut/_${templatename}.scss`,
          scssOutput
        );

        console.log("SCSS file generated successfully!");
        resolve(true);
      });
    });
  },
  /*
   * Adds Controller import/use statment to tl_content.php (dca)
   */
  add_controller_dca: async function (input, bundlename) {
    return new Promise(async function (resolve, reject) {
      const newLines = `use App\\${bundlename}\\Controller\\ContentElement\\${input.controllername}Controller;`;

      gulp
        .src(`src/${bundlename}/Resources/contao/dca/tl_content.php`)
        .pipe(
          replace("// ##CONTROLLERS##", "// ##CONTROLLERS##" + "\n" + newLines)
        )
        .pipe(gulp.dest(`contao-toolset/extra/templates-ext/ouptut/`));

      resolve(true);
    });
  },
  /*
   * Adds Controller import/use statment to tl_content.php (languages)
   */
  add_controller_languages: async function (input, bundlename) {
    return new Promise(async function (resolve, reject) {
      const newLines = `use App\\${bundlename}\\Controller\\ContentElement\\${input.controllername}Controller;`;
      const newLines_translation = `$GLOBALS['TL_LANG']['CTE'][${input.controllername}Controller::TYPE] = ['${input.name}', ''];`;

      gulp
        .src(`src/${bundlename}/Resources/contao/languages/de/tl_content.php`)
        .pipe(
          replace("// ##CONTROLLERS##", "// ##CONTROLLERS##" + "\n" + newLines)
        )
        .pipe(
          replace(
            "##CONTENT_ELEMENTS##",
            "##CONTENT_ELEMENTS##" + "\n" + newLines_translation
          )
        )
        .pipe(rename(`tl_content_lang.php`))
        .pipe(gulp.dest(`contao-toolset/extra/templates-ext/ouptut/`));

      resolve(true);
    });
  },

  /*
   * imports generated scss partial into main scss file
   */
  import_scss_partial: async function (input, bundlename) {
    return new Promise(async function (resolve, reject) {
      const filePath = `src/${bundlename}/Resources/public/css/customelements.scss`;
      const lineToAppend = `\n@import "./scss/${input.prefix_lowercase}_${input.controllername_lowercase}";`;

      /* 
      Ensures that the file exists. If the file that is requested to be created is in directories that do not exist, these directories are created. If the file already exists, it is NOT MODIFIED.
      */
      try {
        await fs.ensureFile(filePath);
        //console.log("success!");
      } catch (err) {
        console.error(err);
      }

      try {
        await fs.promises.appendFile(filePath, lineToAppend);
        //console.log("Line appended successfully.");
        resolve(true);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    });
  },
  /*
   * moves generated output into contao projekt folders ( of selected bundle and creates missing folders)
   */
  move_output: async function (input, bundlename) {
    return new Promise(async function (resolve, reject) {
      let confirm = await abfrage_ja_nein(
        "Bitte ouput prüfen und verschieben bestätigen 🙈 (templates-ext ouput folder)"
          .warn
      );

      if (confirm["selected"] == "Ja") {
        // template
        await module.exports.import_scss_partial(input, bundlename);

        try {
          let src = `contao-toolset/extra/templates-ext/ouptut/${
            input.prefix_lowercase +
            "_" +
            input.controllername_lowercase +
            ".html5"
          }`;
          await fs.ensureDir(`src/${bundlename}/Resources/contao/templates/`);

          let dest = `src/${bundlename}/Resources/contao/templates/${
            input.prefix_lowercase +
            "_" +
            input.controllername_lowercase +
            ".html5"
          }`;

          await fs.move(src, dest);
          //console.log("success!");
        } catch (err) {
          console.error("move_template".error, err);
        }
        // scss
        try {
          let src = `contao-toolset/extra/templates-ext/ouptut/_${
            input.prefix_lowercase +
            "_" +
            input.controllername_lowercase +
            ".scss"
          }`;
          await fs.ensureDir(`src/${bundlename}/Resources/public/css/scss/`);

          let dest = `src/${bundlename}/Resources/public/css/scss/_${
            input.prefix_lowercase +
            "_" +
            input.controllername_lowercase +
            ".scss"
          }`;

          await fs.move(src, dest);
          //console.log("success!");
        } catch (err) {
          console.error("move_scss".error, err);
        }
        // controller
        try {
          let src = `contao-toolset/extra/templates-ext/ouptut/${
            input.controllername + "Controller" + ".php"
          }`;
          await fs.ensureDir(`src/${bundlename}/Controller/ContentElement/`);

          let dest = `src/${bundlename}/Controller/ContentElement/${
            input.controllername + "Controller" + ".php"
          }`;

          await fs.move(src, dest);
          //console.log("success!");
        } catch (err) {
          console.error("move_controller".error, err);
        }
        // tl_content (dca)
        try {
          let src = `contao-toolset/extra/templates-ext/ouptut/tl_content.php`;
          let dest = `src/${bundlename}/Resources/contao/dca/tl_content.php`;
          await fs.ensureDir(`src/${bundlename}/Resources/contao/dca/`);

          await fs.move(src, dest, { overwrite: true });
          //console.log("success!");
        } catch (err) {
          console.error("move_tl_content_dca".error, err);
        }
        // tl_content (lang)
        try {
          let src = `contao-toolset/extra/templates-ext/ouptut/tl_content_lang.php`;
          let dest = `src/${bundlename}/Resources/contao/languages/de/tl_content.php`;
          await fs.ensureDir(
            `src/${bundlename}/Resources/contao/languages/de/`
          );

          await fs.move(src, dest, { overwrite: true });

          //console.log("success!");
        } catch (err) {
          console.error("move_tl_content_dca".error, err);
        }
      }

      resolve(true);
    });
  },

  bundles_list: async function () {
    return new Promise(async function (resolve, reject) {
      // Specify the directory path
      const directory = "src";

      // Get a list of all folders in the directory
      fs.readdir(directory, { withFileTypes: true }, (err, files) => {
        if (err) {
          console.error("Error reading directory:", err);
          return;
        }

        // Filter out only the directories
        const folders = files
          .filter((file) => file.isDirectory())
          .map((file) => file.name);

        // Specify the string to filter
        const stringToFilter = "ContaoManager";

        // Filter out the item with the specific string
        const filteredfolders = folders.filter(
          (item) => item !== stringToFilter
        );

        resolve(filteredfolders);
      });
    });
  },
};
