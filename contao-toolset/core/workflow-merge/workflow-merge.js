const {current_branch} = require("../workflow-switch-branch/workflow-switch-branch")
const {feature_strategy} = require("./feature-strategy")
const {hotfix_strategy} = require("./hotfix-strategy")

module.exports = {

  workflow_merge_core: async function () {
    return new Promise(async function (resolve, reject) {
      let branch = await current_branch();
      if (branch.startsWith("feature-")) {
        await feature_strategy(branch);
      }
      if (branch.startsWith("hotfix-")) {
        await hotfix_strategy(branch);
      }
    });
  },

};


