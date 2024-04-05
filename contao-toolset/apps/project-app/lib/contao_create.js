const fs = require("fs-extra");
const { prompt_select, prompt_text } = require("../../../core/prompts/prompts");
const { php_version } = require("./php_version");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { lupcom_bundles } = require("./lupcom_bundles");
const {
  ora_loading_default_start,
  ora_loading_default_stop,
} = require("../../../core/console/console");

module.exports = {
  contao_create: async function () {
    let version = await module.exports.select_version();
    let public_dir = await module.exports.select_public_dir();
    let original_php_version = await php_version(version);
    let foldername = await module.exports.input_foldername();
    //console.log("foldername:", foldername);

    await module.exports.create_project(version.value, foldername.value);
    await module.exports.add_public_dir_to_composer_json(
      foldername.value,
      public_dir.value
    );
    await module.exports.add_php_73_require_statement(foldername.value);

    let installed_all_without_errors = await lupcom_bundles(foldername.value);
    if (installed_all_without_errors == false) {
      console.log(
        " add_lupcom_bundles ".bgWhite.black +
          ` Skipping installation `.bgYellow.black
      );
    }

    await module.exports.install_project(foldername.value);
    await module.exports.update_project(foldername.value);

    /*     console.log("===================================".info);
    console.log(`         SWITCH BACK TO PHP ${original_php_version}`.info);
    console.log("===================================".info); */

    return {
      success: true,
      foldername: foldername,
      original_php_version: original_php_version,
    };
  },

  select_version: async function () {
    let selected_contao_version = await prompt_select(
      "Welche Contao Version soll das Projekt nutzen?",
       [{ value: "4.9" }, { value: "4.13" }, { value: "5" }]
    );
    return selected_contao_version;
  },

  select_public_dir: async function () {
    let selected_contao_version = await prompt_select(
      "Public Directory wählen",
      [{ value: "web" }, { value: "public" }]
    );
    return selected_contao_version;
  },

  add_php_73_require_statement: async function (foldername, public_dir) {
    let composer_json = await fs.readJson(
      "./contao-toolset/apps/project-app/output" +
        "/" +
        foldername +
        "/composer.json"
    );
    composer_json["require"]["php"] = `^7.3`;
    await fs.writeJson(
      "./contao-toolset/apps/project-app/output" +
        "/" +
        foldername +
        "/composer.json",
      composer_json,
      { spaces: 2 }
    );

    return true;
  },
  add_public_dir_to_composer_json: async function (foldername, public_dir) {
    let composer_json = await fs.readJson(
      "./contao-toolset/apps/project-app/output" +
        "/" +
        foldername +
        "/composer.json"
    );
    composer_json["extra"]["public-dir"] = `${public_dir}`;
    await fs.writeJson(
      "./contao-toolset/apps/project-app/output" +
        "/" +
        foldername +
        "/composer.json",
      composer_json,
      { spaces: 2 }
    );
    console.log(
      " add_public_dir_to_composer_json ".bgWhite.black + ` OK `.black.dim
    );
    return true;
  },

  input_foldername: async function () {
    let input = await prompt_text(
      "Bitte Ordnernamen eingeben (Konvention name.loc)"
    );
    return input;
  },

  create_project: async function (version, foldername) {
    /*     console.log("===================================".warn);
    console.log("           BITTE WARTEN            ".warn);
    console.log("===================================".warn);
    console.log(
      `composer create-project --no-install contao/managed-edition ${foldername} ${version}`
        .warn
    ); */

    console.log("\n");
    console.log(
      " create_project ".bgWhite.black +
        ` composer create-project --no-install contao/managed-edition ${foldername} ${version} `
          .bgCyan.black
    );

    const { stdout, stderr } = await exec(
      `composer create-project --no-install contao/managed-edition ${foldername} ${version}`,
      { cwd: "contao-toolset/apps/project-app/output" }
    );
    await exec(`composer config allow-plugins.php-http/discovery true`, {
      cwd: `contao-toolset/apps/project-app/output/${foldername}`,
    });
    /*     console.log("===================================".success);
    console.log("      PROJEKT WIRD ERSTELLT       ".success);
    console.log("===================================".success);
    console.log("Zielordner: contao-toolset/apps/project-app/output".success); */
    console.log(
      " create_project ".bgWhite.black +
        ` ouputfolder: contao-toolset/apps/project-app/output" `.bgCyan.black
    );

    return foldername;
  },

  install_project: async function (foldername) {
    console.log("\n");
    let spinner = await ora_loading_default_start("Composer Install gestartet");
    /*     console.log("===================================".info);
    console.log("           Installiere             ".info);
    console.log("===================================".info); */
    const { stdout, stderr } = await exec(`composer install`, {
      cwd: `contao-toolset/apps/project-app/output/${foldername}`,
    });
    await ora_loading_default_stop(spinner, "Composer Install abgeschlossen");
    return true;
  },

  update_project: async function (foldername) {
    let spinner = await ora_loading_default_start("Composer Update gestartet");
    /*     console.log("===================================".brightCyan);
    console.log("           Composer Update         ".brightCyan);
    console.log("===================================".brightCyan); */
    const { stdout, stderr } = await exec(`composer update`, {
      cwd: `contao-toolset/apps/project-app/output/${foldername}`,
    });
    await ora_loading_default_stop(spinner, "Composer Update abgeschlossen");
    return true;
  },
};
