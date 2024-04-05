const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs-extra");

module.exports = {
  lupcom_bundles: async function (foldername) {
    /*  */
    let packeton_entry_added = await module.exports.add_packeton_entry(
      foldername
    );
    if (packeton_entry_added) {
      await module.exports.add_lupcom_bundles(foldername);
    }
    return true;
  },
  add_packeton_entry: async function (foldername) {
    try {
      let composer_path = `contao-toolset/apps/project-app/output/${foldername}/composer.json`;
      let jsonObject = await fs.readJSON(composer_path);

      // Create the new repository object
      let newRepository = {
        type: "composer",
        url: "https://steffenunger:tPGxbUD2B6mOmLIMZPSD@packeton.lup.me",
      };

      jsonObject.repositories = [newRepository];

      await fs.writeJSON(composer_path, jsonObject, { spaces: 2 });
      return true;
    } catch (error) {
      console.log("error:", error);
      return false;
    }

    /* 
  "repositories": [{
    "type": "composer",
    "url": "https://steffenunger:tPGxbUD2B6mOmLIMZPSD@packeton.lup.me"
  }],
*/
  },
  add_lupcom_bundles: async function (foldername) {
    let project_composer_json = `contao-toolset/apps/project-app/output/${foldername.value}/composer.json`;

    let non_lupcom = [
      "menatwork/contao-multicolumnwizard-bundle:^3.5",
      "terminal42/contao-easy_themes:^3.1",
      "terminal42/notification_center:^1.5",
      "terminal42/contao-leads:^1.4",
    ];

    let lupcom = [
      "lupcom/easy-backend-bundle:^0.1.2",
      "lupcom/autometa-bundle:^0.1.7",
      "lupcom/forwardlist-bundle:^1.0",
      "lupcom/imagemanager-bundle:^0.4.6",
      "lupcom/load-script-bundle:^3.0",
      "lupcom/opengraph-bundle:^0.2.25",
      "lupcom/ce-bundle:^0.1.19",
      "lupcom/formadd-bundle:0.2.*",
      "lupcom/lazyload-bundle:^0.2.29",
      "lupcom/uploader-bundle:^0.5.11",
      "fightbulc/moment:^1.34",
    ];

    /* 
        "contao/calendar-bundle": "^4.13",
    "contao/comments-bundle": "^4.13",
    "contao/conflicts": "@dev",
    "contao/faq-bundle": "^4.13",
    "contao/listing-bundle": "^4.13",
    "contao/manager-bundle": "4.13.*",
    "contao/news-bundle": "^4.13",
    "contao/newsletter-bundle": "^4.13",
    "lupcom/easy-backend-bundle": "^0.1.2",
    "lupcom/lazyload-bundle": "^0.2.29",
    "lupcom/forwardlist-bundle": "^1.0",
    "lupcom/formadd-bundle": "0.2.*",
    "lupcom/uploader-bundle": "^0.5.11",
    "lupcom/load-script-bundle": "^3.0",
    "lupcom/imagemanager-bundle": "^0.4.6",
    "terminal42/contao-easy_themes": "^3.1",
    "menatwork/contao-multicolumnwizard-bundle": "^3.5",
    "lupcom/avalex-bundle": "0.2.4",
    "madeyourday/contao-rocksolid-antispam": "^2.1",
    "terminal42/notification_center": "^1.5",
    "terminal42/contao-leads": "^1.4",
    "terminal42/contao-ajaxform": "^1.3",
    "lupcom/opengraph-bundle": "^0.2.25",
    "lupcom/ce-bundle": "^0.1.19",
    "lupcom/autometa-bundle": "^0.1.7"
     */

    let bundles = [...non_lupcom, ...lupcom];

    for (const bundle of bundles) {
      const { stdout, stderr } = await exec(`composer require ${bundle}`, {
        cwd: `contao-toolset/apps/project-app/output/${foldername}`,
      });

      if (stderr) {
        console.log(
          " add_lupcom_bundles ".bgWhite.black + ` ${bundle} `.black.dim
        );
        //return false;
      } else {
        console.log(
          " add_lupcom_bundles ".bgWhite.black + ` ${bundle} `.black.dim
        );
      }
    }
    return true;
  },
};
