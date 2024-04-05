const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs-extra");

module.exports = {
  contao_bundles: async function (foldername) {
    await module.exports.remove(foldername);

    return true;
  },

  remove: async function (foldername) {
    let contao = [
      "contao/comments-bundle",
      "contao/listing-bundle",
      "contao/newsletter-bundle",
      "contao/faq-bundle",
    ];

    let bundles = contao;

    try {
      for (const bundle of bundles) {
     
        const { stdout, stderr } = await exec(`composer remove ${bundle}`, {
          cwd: `contao-toolset/apps/project-app/output/${foldername.value}`,
        });
  
        if (stderr) {
          console.log(
            " remove_contao_bundles ".bgWhite.black + ` ${bundle} `.yellow.dim
          );
          //return false;
        } else {
          console.log(
            " remove_contao_bundles ".bgWhite.black + ` ${bundle} `.yellow.dim
          );
        }
      }
    } catch (error) {
      console.log('remove:', error)
      
    }


    return true;
  },
};
