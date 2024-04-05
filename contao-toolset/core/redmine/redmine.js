const axios = require("axios");
const branchName = require("current-git-branch");

try {
  var php_versioncheck_core = require("../php-versioncheck/php-versioncheck.js");
} catch (error) {}
try {
  var workflow_switch_branch_core = require("../workflow-switch-branch/workflow-switch-branch.js");
} catch (error) {}

const {
  abfrage_ja_nein
} = require('../prompts/prompts');

const redmine_conf = require("../../credentials.json")
const lazycommit = require("../../../gulpfile.js");

module.exports = {
  ticketpush: async function () {
    return new Promise(async function (resolve, reject) {

      let current_active_branch = branchName(); // false or branch name of process.cwd()
      try {
        let check = await php_versioncheck_core.app_check_if_up_to_date();
        if (check == false) {
          return;
        }
      } catch (error) {
        console.log("consider installing > php-versioncheck".info);
      }

      let tickets = await module.exports.my_open_tickets();

      let choices = [];
      for (const item of tickets) {
        choices.push(item["id"] + " --- " + item["subject"]);
      }

      let redmine_id = await abfrage_ja_nein(
        "Redmine Ticket",
        choices
      );

      let id = redmine_id["selected"].split("---")[0];
      console.log("id:", id);

      let abfrage_commit_msg = await lazycommit.abfrage_single_input();
      let read = await lazycommit.readJson();
      if (read) {
        await lazycommit.writeJson(abfrage_commit_msg["selected"], read);

      }
      if (abfrage_commit_msg == "") {
        lazycommit.add_commit_push("update", current_active_branch);
      } else {
        lazycommit.add_commit_push(
          "+ " + "#" + id + " - " + abfrage_commit_msg["selected"],
          current_active_branch
        );
        resolve("OK");
      }
    });
  },
  my_open_tickets: async function () {
    return new Promise(async function (resolve, reject) {
      try {
        let mytickets = await axios.get(
          "https://support.lupcom.de/issues.json?assigned_to_id=me",
          {
            headers: {
              "Content-Type": "application/json",
              "X-Redmine-API-Key": redmine_conf.redmine_api_key,
            },
          }
        );
        resolve(mytickets["data"]["issues"]);
      } catch (error) {
        console.log("error:", error);
      }
    });
  },
};

