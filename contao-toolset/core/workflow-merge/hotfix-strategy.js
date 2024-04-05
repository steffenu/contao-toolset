const {
  Git
} = require('git-interface');
const {prompt_toggle} = require('../prompts/prompts')
const git = new Git({});
//var exec = require("child_process").exec;
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const {detect_master_branch}= require("./feature-strategy")

module.exports = {

  hotfix_strategy: async function (hotfix_branchname) {
    return new Promise(async function (resolve, reject) {
      console.log("===================================".red);
      console.log("       🔥 HOTFIX-STRATEGY 🔥       ");
      console.log("===================================".red);
      console.log("Abzweigung von".red + " master/main ".green +"branch".red);

      let hotfixemerge_success = await module.exports.merge_develop_with_hotfix(hotfix_branchname);

      if (hotfixemerge_success) {
        await module.exports.merge_master_with_hotfix(hotfix_branchname);
        await git.checkout(hotfix_branchname); // switch back
        let prompt_delete_hotfix = await prompt_toggle(`hotfix`.red + " branch " + "löschen".red + " ?");
        if (prompt_delete_hotfix.value == true) {
          await git.checkout("develop");
          await git.deleteBranch(hotfix_branchname);
        }
        resolve(true)
      } else {
        resolve(false)
      }
    });
  },
  merge_develop_with_hotfix: async function (hotfix_branchname) {
    return new Promise(async function (resolve, reject) {
      let prompt_merge_hotfix = await prompt_toggle(`develop`.warn + " mit " + "hotfix".red + " mergen ?");

      if (prompt_merge_hotfix.value) {
        await git.checkout("develop");
        await git.pull();
        let conflictList = await git.getConflictList();

        if (conflictList.length == 0) {
          
          const { stdout, stderr } = await exec(`git merge ${hotfix_branchname}`);
          //exec(`git merge ${hotfix_branchname}`);
          conflictList = await git.getConflictList();
          if (conflictList.length == 0) {
            await git.push(); // push develop
            resolve(true)
          } else {
            console.log("Merge Conflicts found".info, `${conflictList}`.red);
            resolve(false)
          }
        } else {
          console.log("Merge Conflicts found".info, `${conflictList}`.red);
          resolve(false)
        }
      } else {
        resolve(false)
      }

    });
  },
  merge_master_with_hotfix: async function (hotfix_branchname) {
    return new Promise(async function (resolve, reject) {
      let prompt_merge_hotfix = await prompt_toggle(`master`.warn + " mit " + "hotfix".red + " mergen ?");

      if (prompt_merge_hotfix.value) {
        let master_or_main = await detect_master_branch()
        await git.checkout(master_or_main);
        master_or_main = await detect_master_branch()
        await git.pull();
        let conflictList = await git.getConflictList();

        if (conflictList.length == 0) {
          const { stdout, stderr } = await exec(`git merge ${hotfix_branchname}`);

          conflictList = await git.getConflictList();
          if (conflictList.length == 0) {
            master_or_main = await detect_master_branch()
            await git.push(); // push master
            resolve(true)
          } else {
            console.log("Merge Conflicts found".info, `${conflictList}`.red);
            resolve(false)
          }
        } else {
          console.log("Merge Conflicts found".info, `${conflictList}`.red);
          resolve(false)
        }
      } else {
        resolve(false)
      }
    });
  },
};


