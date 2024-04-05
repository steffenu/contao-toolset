const fs = require("fs-extra");
const branchName = require("current-git-branch");
var gulp = require("gulp");
const { Git } = require("git-interface");
const git = new Git({});
const { abfrage_ja_nein } = require("../prompts/prompts");

module.exports = {
  git_core: async function () {
    return true;
  },
  last_changes: async function () {
    const lastChanges = await git.getLastChanges();
    console.log("lastChanges:".success);
    console.log(`${lastChanges}`.info);
    return true;
  },
  time_last_commit: async function () {
    const timeOfLastCommit = await git.getTimeOfLastCommit("main");
    console.log("timeOfLastCommit:", timeOfLastCommit);
    return true;
  },
  active_branch: async function () {
    const branch = await git.getBranchName();
    if (branch == "main") {
      console.log("branch:".info, `${branch}`.green);
    } else if (branch == "master") {
      console.log("branch:".info, `${branch}`.green);
    } else if (branch == "develop") {
      console.log("branch:".info, `${branch}`.warn);
    } else if (branch.startsWith("feature-")) {
      console.log("branch:".info, `${branch}`.verbose);
    } else if (branch.startsWith("hotfix-")) {
      console.log("branch:".info, `${branch}`.red);
    }
    return gulp.src("./README.md");
  },
  is_feature_branch: async function () {
    const branch = await git.getBranchName();
    return branch.startsWith("feature-");
  },
  is_hotfix_branch: async function () {
    const branch = await git.getBranchName();
    return branch.startsWith("hotfix-");
  },
  merge_conflict_list: async function () {
    const conflictList = await git.getConflictList();
    console.log("conflictList:", conflictList);
    return true;
  },
  uncommitted_list: async function () {
    const uncomittedList = await git.getUncommittedList();

    if (uncomittedList.length > 9) {
      console.log("uncomittedList:".red);
      uncomittedList.forEach((element) => {
        console.log(`${element}`.warn);
      });
      let confirm_staging = await abfrage_ja_nein(
        "Sicherheitsabfrage 👷 : 10 oder mehr Dateien geändert. Fortfahren ?"
      );

      if (confirm_staging["selected"] == "Ja") {
        return true;
      } else {
        return false;
      }
    }
    // wenn weniger als 10 Dateien geändert wurden
    // keine Kontrolle notwendig
    return true;
  },
};
