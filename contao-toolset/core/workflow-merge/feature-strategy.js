const {
  Git
} = require('git-interface');
const {
  prompt_toggle,
  prompt_text
} = require('../prompts/prompts')
const git = new Git({});
//var exec = require("child_process").exec;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
module.exports = {

  feature_strategy: async function (feature_branchname) {
    return new Promise(async function (resolve, reject) {
      console.log("===================================".verbose);
      console.log("       ⚽ FEATURE-STRATEGY ⚽       ");
      console.log("===================================".verbose);
      console.log("Abzweigung von".verbose + " develop ".warn + "branch".verbose);

      let featuremerge_success = await module.exports.merge_develop_with_feature(feature_branchname);

      if (featuremerge_success) {
        let mastermerge_success = await module.exports.merge_master_with_develop(feature_branchname);
      
        if(mastermerge_success == "eingabefehler"){
          console.log("Bestätigungseingabe inkorrekt ⛔".red)
          resolve(false)
          return
        }
        if (mastermerge_success == true) {
          await git.checkout(feature_branchname); // switch back
        } else {
          console.log("===================================".red);
          console.log("   Bitte Merge Konflikte auflösen".red)
          console.log("===================================".red);
          resolve(false)
          return
        }
        let prompt_delete_feature = await prompt_toggle(`feature`.verbose + " branch " + "löschen".red + " ?");
        if (prompt_delete_feature.value == true) {
          await git.checkout("develop");
          await git.deleteBranch(feature_branchname);
        }
        resolve(true)
      } else {
        console.log("===================================".red);
        console.log("   Bitte Merge Konflikte auflösen".red)
        console.log("===================================".red);
        resolve(false)
      }
    });
  },
  merge_develop_with_feature: async function (feature_branchname) {
    return new Promise(async function (resolve, reject) {

      let prompt_merge_feature = await prompt_toggle(`develop`.warn + " mit " + "feature".verbose + " mergen ?");

      if (prompt_merge_feature.value) {
        await git.checkout("develop");
        let pullconflicts = await module.exports.pullconflicts();

        if (pullconflicts == false) {
          let merge_develop_conflicts = await module.exports.merge_develop_conflicts(feature_branchname);

          if (merge_develop_conflicts == false) {
            resolve(true)
          } else{
            resolve(false)
          }
        }
      } else {
        resolve(false)
      } 
    });
  },
  merge_master_with_develop: async function (feature_branchname) {
    return new Promise(async function (resolve, reject) {

      let merge_master = await prompt_toggle(`master`.green + " mit " + "develop".warn + " mergen ?");

      merge_master = await prompt_text(`Achtung ! Bitte Masterbranch-merge bestätigen.`.red + " Tippe dafür " + `${feature_branchname} `.red + "in das Eingabefeld");

      if (merge_master.value == feature_branchname) {
        let master_or_main = await module.exports.detect_master_branch()
        git.checkout(master_or_main);
        let pullconflicts = await module.exports.pullconflicts();

        if (pullconflicts == false) {
          let merge_master_conflicts = await module.exports.merge_master_conflicts();
          if (merge_master_conflicts == false) {
            resolve(true)
          } else{
            resolve(false)
          }
        }
      } else {
        resolve("eingabefehler")
      }
    });
  },
  detect_master_branch: async function () {
    return new Promise(async function (resolve, reject) {
      const branches = await git.getLocalBranchList();
      if (branches.includes("master")) {
        resolve("master");
      } else if (branches.includes("main")) {
        resolve("main");
      }
    });
  },
  pullconflicts: async function () {
    return new Promise(async function (resolve, reject) {

      try {
        //await git.pull();
        await exec(`git pull`);
        resolve(false);
      } catch (error) {
        let conflictList = await git.getConflictList();
        //exec(`git merge develop`);
        conflictList = await git.getConflictList();
        if (conflictList.length == 0) {
          resolve(false)
        } else {
          console.log("Pull - Merge Conflicts found".info, `${conflictList}`.red);
          resolve(true)
        }
      }
    });
  },
  merge_master_conflicts: async function () {
    return new Promise(async function (resolve, reject) {

      try {
        await exec(`git merge develop`);
        await git.push(); // push develop
        resolve(false);
      } catch (error) {

        //exec(`git merge develop`);
        conflictList = await git.getConflictList();
        if (conflictList.length == 0) {
          await git.push(); // push develop
          resolve(false)
        } else {
          console.log("Merge Master - Merge Conflicts found".info, `${conflictList}`.red);
          resolve(true)
        }
      }
    });
  },
  merge_develop_conflicts: async function (feature_branchname) {
    return new Promise(async function (resolve, reject) {

      try {
        await exec(`git merge ${feature_branchname}`);
        await git.push(); // push develop
        resolve(false);
        
      } catch (error) {

        conflictList = await git.getConflictList();
        if (conflictList.length == 0) {
          await git.push(); // push develop
          resolve(false)
        } else {
          console.log("Merge Develop - Merge Conflicts found".info, `${conflictList}`.red);
          resolve(true)
        }
      }
    });
  },
};