const fs = require("fs-extra");

var hostile = require("hostile");
var exec = require("child_process").exec;
const { prompt_toggle } = require("../prompts/prompts");
const {
  verify_hosts_entry,
  verify_foldername,
  verify_folder_path,
} = require("../verify/verify");

module.exports = {
  hosts: async function () {
    return new Promise(async function (resolve, reject) {
      // guard - do not attempt setup outside of dev environment
      if ((await verify_folder_path()) == false) {
        resolve(false);
        return;
      }

      let host_entry_exists = await verify_hosts_entry();
      let foldername_verified = await verify_foldername();

      if (host_entry_exists == false) {
        if (foldername_verified.verified == false) {
          console.log(
            "Ordnername entspricht nicht der Konvention name.loc".red
          );
        }
        // abfrage host entry hinzufügen
        var host_entry_prompt = await prompt_toggle(
          "Eintrag der hosts Datei hinzufügen ?"
        );

        if (host_entry_prompt.value) {
          console.log(
            "Please grant acces to hosts file  by running: sudo chmod o+w /etc/hosts"
              .info
          );
          await module.exports.add_hosts_file_entry(
            foldername_verified.basename
          );

          resolve(true);
        } else {
          resolve(false);
          //console.log("Running..".info);
        }
      } else {
        resolve(false);
        //console.log("Running..".info);
      }
    });
  },

  add_hosts_file_entry: async function (hostname) {
    return new Promise(async function (resolve, reject) {
      hostile.set("127.0.0.1", hostname, function (err) {
        if (err) {
          console.error(err);
        } else {
          //console.log("set /etc/hosts successfully!");
          console.log(
            " add_hosts_file_entry ".bgWhite.black + " OK ".black.dim
          );
          resolve(true);
        }
      });
    });
  },
};

