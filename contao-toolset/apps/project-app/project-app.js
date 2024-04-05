const fs = require("fs-extra");
const { contao_create } = require("./lib/contao_create");
const { contao_toolset } = require("./lib/contao_toolset");
const { tpl_folderstructure } = require("./lib/tpl_folderstructure");
const { src_default } = require("./lib/src_default");
const { templates } = require("./lib/templates");
const { composer_phar } = require("./lib/composer_phar");
const { gitignore } = require("./lib/gitignore");
const { contao_bundles } = require("./lib/contao_bundles");
const { boxen, symfony_success } = require("../../core/console/console");
const {
  switch_php_version,
} = require("../../extra/php-versionswitch-ext/php-versionswitch-ext");

module.exports = {
  project_generator_app: async function () {
    return new Promise(async function (resolve, reject) {
      await boxen("Contao Projekte Erstellen");
      let created_folder = await contao_create();
      let add_toolset = await contao_toolset(created_folder.foldername);
      let add_tpl = await tpl_folderstructure(created_folder.foldername);
      let add_src = await src_default(created_folder.foldername);
      let add_templates = await templates(created_folder.foldername);
      let add_composer_phar = await composer_phar(created_folder.foldername);
      let add_gitignore = await gitignore(created_folder.foldername);
      let rmv_contao_bundles = await contao_bundles(created_folder.foldername);
      await symfony_success(
        "Verschiebe das Projekt nun in deine Entwicklungsumgebung und führe aus : " +
          "npm run toolset"
      );

      console.log("\n");
      console.log(
        " contao_create ".bgWhite.black +
          ` switch back to php ${created_folder.original_php_version} `.bgCyan
            .black
      );
      console.log("\n");
      await switch_php_version(created_folder.original_php_version);

      resolve(true);
    });
  },
};
