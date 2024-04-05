var Spinner = require("cli-spinner").Spinner;

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
};