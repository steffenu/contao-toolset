const prompts = require('prompts');
var gulp = require("gulp");
var prompt = require("gulp-prompt");
module.exports = {
  prompt_testapp: async function () {
    let antwort = await module.exports.prompt_text();
    console.log('antwort:', antwort);
  },
  prompt_text: async function (message = "Bitte Text Eingeben") {

      const response = await prompts({
        type: 'text',
        name: 'value',
        message: message
      });
      return response;
  },
  prompt_toggle: async function (message = "Bestätigen") {

      const response = await prompts({
        type: 'toggle',
        name: 'value',
        message: message,
        initial: false,
        active: 'Ja',
        inactive: 'Nein'
      });
      return response;
  },
  prompt_select: async function (message = "Bitte Wählen", choices = [
    { title: 'Red', description: 'This option has a description', value: '#ff0000' },
    { title: 'Green', value: '#00ff00', disabled: true },
    { title: 'Blue', value: '#0000ff' }
  ]) {

      const response = await prompts({
        type: 'select',
        name: 'value',
        message: message,
        choices: choices,
        initial: 0
      });
      return response;
  },
  prompt_multiselect: async function (message = "Bitte Wählen [Mehrfachauswahl möglich]", choices = [
    { title: 'Red', value: '#ff0000' },
    { title: 'Green', value: '#00ff00', disabled: true },
    { title: 'Blue', value: '#0000ff', selected: true }
  ],max = 0 , hint = "- Space to select. Return to submit") {

      const response = await prompts({
        type: 'autocompleteMultiselect',
        name: 'value',
        message: message,
        choices: choices,
        max: max,
        hint: hint
      });
      return response;
  },
  format_array: function (array){
    let obj =[]
    for (const item of array) {
      obj.push({value:item})
    }
    return obj;
  },
  abfrage_ja_nein: async function (message, choices = ["Ja", "Nein"]) {
    return new Promise(function (resolve, reject) {
      return gulp.src("README.md").pipe(
        prompt.prompt({
            type: "list",
            name: "selected",
            message: message,
            choices: choices,
            pageSize: "6",
          },
          (res) => {
            console.log("Result", res);
            resolve(res);
          }
        )
      );
    });
  }
};
