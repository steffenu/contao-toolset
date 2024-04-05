const { php } = require("./php");
const { docker } = require("./docker");
const { hosts } = require("./hosts");
const { nginx } = require("./nginx");
const { contao_info } = require("./contao_info");
const { gitlab_info } = require("./gitlab_info");

module.exports = {
  setup_core: async function () {
    await gitlab_info();
    await contao_info();
    await php();
    await docker();
    await nginx();
    await hosts();
    return true;
  },
};
