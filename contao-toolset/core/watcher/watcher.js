
const {html} =require("./html");
const {scss} =require("./scss");
const {js} =require("./js");
const {ts} =require("./ts");
const {contao_dca} =require("./contao_dca");
const {contao_lang} =require("./contao_lang");
const {browsersync} =require("./lib/browsersync/browsersync");
const settings = require("../../../contao-info.json");
const {verify_foldername} =require("../verify/verify");

module.exports = {
  watcher: async function () {
    let foldername = await verify_foldername();
    if (settings.browsersync == 2) {var bs = await browsersync(foldername.basename);}     
    html(bs);
    scss(bs);
    js(bs);
    ts(bs);
    contao_dca();
    contao_lang();
  },

}