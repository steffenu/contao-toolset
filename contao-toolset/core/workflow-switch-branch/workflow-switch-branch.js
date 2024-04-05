const {
  Git
} = require('git-interface');

const git = new Git({});

const {
  prompt_select,
  prompt_text,
  abfrage_ja_nein
} = require('../prompts/prompts');
const {
  detect_master_branch
} = require('../workflow-merge/feature-strategy');

module.exports = {

  workflow_switch_branch_core: async function () {
    return new Promise(async function (resolve, reject) {
      let has_master_branch = await module.exports.detect_master_branch()
      let has_develop_branch = await module.exports.detect_develop_branch()
      let has_feature_branch = await module.exports.detect_feature_branch()
      let has_hotfix_branch = await module.exports.detect_hotfix_branch()
      let current_branch = await module.exports.current_branch()

      // Erweiterung wird aktiv
      if (has_master_branch && has_develop_branch && (has_feature_branch || has_hotfix_branch)) {

        if (current_branch.startsWith("feature-") == true || current_branch.startsWith("hotfix-") == true) {
          resolve(true);
          return
        }
        // Auswahl der Branch Art
        let branch_select = await prompt_select("Bitte wähle aus", [{
            title: 'feature-branch nutzen',
            value: 'feature-branch',
            disabled: !has_feature_branch
          },
          {
            title: 'hotfix-branch nutzen',
            value: 'hotfix-branch',
            disabled: !has_hotfix_branch
          },
          {
            title: 'neuen branch erstellen',
            value: 'neuer-branch'
          }
        ]);
        console.log('branch_select:', branch_select)
        if (branch_select.value == "feature-branch") {
          let branchlist = await module.exports.feature_branch_list()
          if (branchlist) {
            let select_branch = await abfrage_ja_nein("Wähle " + "feature ".verbose + "branch", branchlist);
            git.checkout(select_branch["selected"]);
          }
        }
        if (branch_select.value == "hotfix-branch") {
          let branchlist = await module.exports.hotfix_branch_list()
          if (branchlist) {
            let select_branch = await abfrage_ja_nein("Wähle " + "hotfix ".red + " branch", branchlist);
            git.checkout(select_branch["selected"]);
          }
        }
        if (branch_select.value == "neuer-branch") {
          await module.exports.create_workflow_branch()
          resolve(false);
        }

        resolve(true);

      } else if (has_master_branch && has_develop_branch && (!has_feature_branch || !has_hotfix_branch)) {
        await module.exports.create_workflow_branch()
        resolve(false);
      } else {
        resolve("masteronly");
      }
    });
  },
  detect_master_branch: async function () {
    return new Promise(async function (resolve, reject) {
      const branches = await git.getLocalBranchList();
      if (branches.includes("master")) {
        resolve("master")
      } else if (branches.includes("main")) {
        resolve("main")
      }
    });
  },
  detect_develop_branch: async function () {
    return new Promise(async function (resolve, reject) {
      const branches = await git.getLocalBranchList();
      if (branches.includes("develop")) {
        resolve(true)
      } else {
        resolve(false)
      }
    });
  },
  detect_feature_branch: async function () {
    return new Promise(async function (resolve, reject) {
      const branches = await git.getLocalBranchList();
      let check = false
      for (const item of branches) {
        if (item.startsWith("feature-")) {
          check = true
        }
      }
      if (check) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  detect_hotfix_branch: async function () {
    return new Promise(async function (resolve, reject) {
      const branches = await git.getLocalBranchList();
      let check = false
      for (const item of branches) {
        if (item.startsWith("hotfix-")) {
          check = true
        }
      }
      if (check) {
        resolve(true)
      } else {
        resolve(false)
      }
    });
  },
  create_workflow_branch: async function () {
    return new Promise(async function (resolve, reject) {
      let feature_or_hotfix = await abfrage_ja_nein("Welche" + " Merge Strategie ".verbose + "möchtest du nutzen?", ["feature", "hotfix"]);
      console.log('feature_or_hotfix:', feature_or_hotfix)

      let branchname = await prompt_text(feature_or_hotfix["selected"] + ` Branch Namen wählen (${feature_or_hotfix["selected"]}` + `-$userinput)`.info);

      console.log('branchname:', feature_or_hotfix["selected"] + "-" + branchname.value)
      let name = feature_or_hotfix["selected"] + "-" + branchname.value

      let master_or_main = await detect_master_branch();
      let branch_abzweigung = await module.exports.current_branch()

      if (feature_or_hotfix["selected"] == "feature") {
        await git.checkout("develop"); // Abzweigung von develop 
        branch_abzweigung = "develop";
      }
      if (feature_or_hotfix["selected"] == "hotfix") {
        await git.checkout(master_or_main); // Abzweigung von master 
        branch_abzweigung = master_or_main;
      }
      console.log("Abzweigung von:".info, `${branch_abzweigung}`.brightCyan);
      console.log(`${branch_abzweigung}`.brightCyan, `aktualisiert für Abzweigung zu`, `${feature_or_hotfix["selected"]}`.verbose);
      await git.pull();
      // Branch erstellen und zu Branchchseln
      await git.createBranch(name);
      await git.checkout(name);
      resolve(true)
    });
  },
  feature_branch_list: async function () {
    return new Promise(async function (resolve, reject) {
      let branches = await git.getLocalBranchList()
      branches = branches.filter(e => e.startsWith("feature-") == true)

      if (branches.length > 0) {
        resolve(branches)
      } else {
        resolve(false)
      }
    });
  },
  hotfix_branch_list: async function () {
    return new Promise(async function (resolve, reject) {
      let branches = await git.getLocalBranchList()
      branches = branches.filter(e => e.startsWith("hotfix-") == true)

      if (branches.length > 0) {
        resolve(branches)
      } else {
        resolve(false)
      }
    });
  },
  current_branch: async function () {
    return new Promise(async function (resolve, reject) {
      const branch = await git.getBranchName();
      resolve(branch);
    });
  },
};