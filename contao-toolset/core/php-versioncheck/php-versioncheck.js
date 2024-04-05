const fs = require("fs-extra");
var Spinner = require("cli-spinner").Spinner;
const gitRepoIsUpToDate = require("git-repo-is-up-to-date");
var exec = require("child_process").exec;
var gulp = require("gulp");
var prompt = require("gulp-prompt");
const axios = require("axios");
var userName = require("git-user-name");
const contao_toolset_conf = "./contao-toolset/contao_toolset.json";
const branchName = require("current-git-branch");
var git = require("gulp-git");
const {
  abfrage_ja_nein
} = require('../prompts/prompts');
const {current_branch} = require("../workflow-switch-branch/workflow-switch-branch");
const gitCommitInfo = require('git-commit-info');
const{php_versionswitch_ext}= require("../../extra/php-versionswitch-ext/php-versionswitch-ext");

module.exports = {
  spinner_start: async function (spinner_string, spinner_text) {
    return new Promise(async function (resolve, reject) {
      var spinner = new Spinner(spinner_text + " %s");
      spinner.setSpinnerDelay(120);
      spinner.setSpinnerString(spinner_string);

      spinner.start();
      resolve(spinner);
    });
  },
  spinner_stop: async function (spinner) {
    return new Promise(async function (resolve, reject) {
      spinner.stop();
      resolve("stopped");
    });
  },
  app_check_if_up_to_date: async function () {
    return new Promise(async function (resolve, reject) {
      let check_conf = await module.exports.check_config_exists(
        contao_toolset_conf
      ); // true or false

      if (check_conf == false) {
        let set_php_version = await abfrage_ja_nein(
          "Welche" +" PHP Version ".brightCyan +"nutzt dieses Projekt",
          ["7.3", "7.4", "8.1","8.2"]
        );
        await module.exports.create_config(contao_toolset_conf, {
          php_version: set_php_version["selected"],
        });
        console.log("=== config " +  "contao_toolset.json".brightCyan + " erstellt ===");
      } else {
        // read conf and check if php version of repo matches local machines version
        const project_php_version = await fs.readFile(contao_toolset_conf, "utf8");

        let local_active_php_version = await module.exports.get_php_version();

        let check = await module.exports.compare_php_version(
          JSON.parse(project_php_version)["php_version"],
          local_active_php_version
        );

        // wenn falsche php version dann abbruch app
        if (!check) {
          //console.log("WRONG PHP VERSION - Please Check ! ".red);
          await php_versionswitch_ext();
          return false;
        }
      }

      // START SPINNER
      let spinner_1 = await module.exports.spinner_start("⣾⣽⣻⢿⡿⣟⣯⣷", "");
      let id = await module.exports.get_remote_repo_id();
      let info = await module.exports.get_remote_repo_commits(id); // commit info
      let remote_author_name_latest_commit = info["data"][0];
      let remote_author_name = remote_author_name_latest_commit["author_name"];
      let local_git_username = userName();
      module.exports.spinner_stop(spinner_1);

      // wenn autor des letzten commits im remote repo  du selbst bist  ask to git pull
      if (remote_author_name == local_git_username) {
        // dont ask for pull
      } else {
        let remote_repo_info = await module.exports.get_remote_repo_info(id);

        let current_active_branch = branchName(); // false or

        let repo_name = remote_repo_info["data"]["name"];

        // kein new commit kontrolle für feature und
        // hotfix branches , da diese sowieso ein git pull standarmässig 
        // im workflow haben vor dem pushen
        let branch = await current_branch();
        if (branch.startsWith("feature-") == false && branch.startsWith("hotfix-") == false) {

          const{author,message} = gitCommitInfo()
          console.log(`Neuer Remote Commit:`.red + ` ${author} -`.green ,`${message}`.brightCyan )

        let ja_nein = await abfrage_ja_nein(
          `Neuer Commit von ` + ` ${remote_author_name} `.info + ` , git pull durchführen für Project =` + ` ${repo_name}?`.green
        );
        console.log(ja_nein["selected"]);
        if (ja_nein["selected"] == "Ja") {
          console.log("## GIT PULL ##");
          git.pull("origin", current_active_branch, function (err) {
            if (err) console.log(err);
          });
        }
      }
      }
      resolve(true);
    });
  },
  compare_php_version: async function (php_version_project, php_version_local) {
    return new Promise(function (resolve, reject) {
      if (php_version_project == php_version_local) {
        console.log(`Projekt verwendet `+ `PHP ${php_version_project}`.info);
        resolve(true);
      } else {
        console.log(
          `Aktive PHP Version: ${php_version_local}  Benötigte Version: ${php_version_project} !!! `.red
        );
        resolve(false);
      }
    });
  },
  get_remote_repo_commits: async function (repo_id) {
    return new Promise(async function (resolve, reject) {
      try {
        let repo_info = await axios.get(
          `https://gitlab.lupcom.de/api/v4/projects/${repo_id}/repository/commits?private_token=glpat-pXUtjLn4w8dyK5s8K2Ys`
        );
        resolve(repo_info);
      } catch (error) {
        console.log("get_remote_repo_commits failed".red);
      }
    });
  },
  get_remote_repo_info: async function (repo_id) {
    return new Promise(async function (resolve, reject) {
      try {
        let repo_info = await axios.get(
          `https://gitlab.lupcom.de/api/v4/projects/${repo_id}?private_token=glpat-pXUtjLn4w8dyK5s8K2Ys`
        );
        resolve(repo_info);
      } catch (error) {
        console.log("get_remote_repo_info failed".red);
      }
    });
  },
  get_remote_repo_id: async function () {
    return new Promise(async function (resolve, reject) {
      const result = await gitRepoIsUpToDate();

      let result_projects = await module.exports.projects();

      for (const item of result_projects) {
        if (result.remoteUrl == item.ssh_url_to_repo) {
          resolve(item.id);
        }
      }
    });
  },
  projects: async function () {
    const projects = [];

    let url =
      "http://gitlab.lupcom.de/api/v4/projects?private_token=glpat-Gy4aoworausZrkp-XNQ6&per_page=100";
    try {
      const response = await axios.get(url);

      for (const item of response.data) {
        projects.push(item);
      }

      // ADD ALL PAGES TO THE PROJECT NAMES ARRAY
      // PAGE LIMIT = 100 PER PAGE OF API
      if (response.headers["x-total-pages"] > 1) {
        let pages = response.headers["x-total-pages"];

        for (let i = 2; i <= pages; i++) {
          let url = `http://gitlab.lupcom.de/api/v4/groups/contao/projects?private_token=glpat-Gy4aoworausZrkp-XNQ6&per_page=100&page=${i}`;

          const page_response = await axios.get(url);
          for (const item of page_response.data) {
            projects.push(item);
          }
        }
      }
      return projects;
    } catch (error) {
      console.error(error);
    }
  },
  get_php_version: async function () {
    // Shows active version '7.4.30'
    return new Promise(function (resolve, reject) {
      exec('php -r "echo phpversion();"', function (err, stdout, stderr) {
        resolve(stdout.toString().slice(0, 3));
      });
    });
  },
  check_config_exists: async function (f) {
    const exists = await fs.pathExists(f);
    return exists;
  },
  create_config: async function (f, json_obj) {
    try {
      await fs.outputFile(f, JSON.stringify(json_obj));
    } catch (err) {
      console.error(err);
    }
  },
};
