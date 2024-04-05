var exec = require("child_process").exec;
const { abfrage_ja_nein } = require("../../core/prompts/prompts");

module.exports = {
  php_versionswitch_ext: async function () {
    return new Promise(async function (resolve, reject) {
      let phpversionlist = await module.exports.get_php_version_list();
      let phpversionlist_arr = phpversionlist.split("\n").filter((n) => n);

      let phpversion = await abfrage_ja_nein(
        "Wähle PHP Version",
        phpversionlist_arr
      );

      await module.exports.switch_php_version(phpversion["selected"]);

      console.log("Switched to PHP - ".verbose, phpversion["selected"]);

      resolve(true);
    });
  },
  get_php_version_list: async function () {
    //'7.4.30'
    // Shows active version
    return new Promise(function (resolve, reject) {
      exec(
        "ls",
        {
          cwd: "/etc/php",
        },
        function (err, stdout, stderr) {
          console.log(stdout.toString());
          resolve(stdout.toString());
        }
      );
    });
  },
  install_php_82: async function () {
    //'7.4.30'
    // Shows active version
    return new Promise(function (resolve, reject) {
      exec(
        "sudo apt -y install php8.2-cli php8.2-mysql php8.2-sqlite3 php8.2-intl php8.2-mbstring php8.2-curl php8.2-xml php8.2-gd php8.2-zip php8.2-dom php8.2-pdo",
        function (err, stdout, stderr) {
          console.log("☑ PHP 8.2 installiert".info);
          resolve(true);
        }
      );
    });
  },
  install_php_81: async function () {
    return new Promise(function (resolve, reject) {
      exec(
        "sudo apt -y install php8.1-cli php8.1-mysql php8.1-sqlite3 php8.1-intl php8.1-mbstring php8.1-curl php8.1-xml php8.1-gd php8.1-zip php8.1-dom php8.1-pdo",
        function (err, stdout, stderr) {
          console.log("☑ PHP 8.1 installiert".info);
          resolve(true);
        }
      );
    });
  },
  install_php_74: async function () {
    return new Promise(function (resolve, reject) {
      exec(
        "sudo apt -y install php7.4-cli php7.4-mysql php7.4-sqlite3 php7.4-intl php7.4-mbstring php7.4-curl php7.4-xml php7.4-gd php7.4-zip php7.4-dom php7.4-pdo",
        function (err, stdout, stderr) {
          console.log("☑ PHP 7.4 installiert".info);
          resolve(true);
        }
      );
    });
  },
  install_php_73: async function () {
    return new Promise(function (resolve, reject) {
      exec(
        "sudo apt -y install php7.3-cli php7.3-mysql php7.3-sqlite3 php7.3-intl php7.3-mbstring php7.3-curl php7.3-xml php7.3-gd php7.3-zip php7.3-dom php7.3-pdo",
        function (err, stdout, stderr) {
          console.log("☑ PHP 7.3 installiert".info);
          resolve(true);
        }
      );
    });
  },

  switch_php_version: async function (phpversion) {
    return new Promise(function (resolve, reject) {
      exec(
        `sudo update-alternatives --set php /usr/bin/php${phpversion}`,
        function (err, stdout, stderr) {
          console.log(stdout.toString());
          resolve(stdout.toString());
        }
      );
    });
  },
};
