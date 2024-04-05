const fs = require("fs-extra");
const { fstat } = require("fs-extra");
let settings = require("../../../contao-info.json");


module.exports = {

  settings: async function () {
    const {
      Scale
    } = require('enquirer');
    const prompt = new Scale({
      name: 'Settings',
      message: 'Watcher Einstellungen',
      scale: [{
          name: 'alt',
          message: 'Legacy mode'
        },
        {
          name: 'off',
          message: 'Turn off'
        },
        {
          name: 'on',
          message: 'Turn on'
        }
      ],

      choices: [{
          name: 'browsersync',
          message: 'Livereload - Browssersync',
          initial: settings.browsersync
        },
        {
          name: 'puppeteer',
          message: 'Livereload - Puppeteer (new)',
          initial: settings.puppeteer
        },
/*         {
          name: 'puppeteer_extras',
          message: 'Puppeteer - Extras',
          initial: settings.puppeteer_extras
        }, */
        {
          name: 'prettier_html',
          message: 'Prettier - HTML',
          initial: settings.prettier_html
        },
        {
          name: 'prettier_scss',
          message: 'Prettier - SCSS',
          initial: settings.prettier_scss
        },
        {
          name: 'prettier_js',
          message: 'Prettier - JS',
          initial: settings.prettier_js
        },
        {
          name: 'lint',
          message: 'Linting - HTML , CSS , JS',
          initial: settings.lint
        },

        {
          name: 'fileheaders',
          message: 'Fileheaders - Datum und Autor',
          initial: settings.fileheaders
        },
/*         {
          name: 'fileheader_status',
          message: 'Fileheaders - Status anzeigen',
          initial: settings.fileheaders_status
        }, */
        {
          name: 'compile_scss',
          message: 'Kompilieren - SCSS',
          initial: settings.compile_scss
        },
        {
          name: 'compile_scss_bem',
          message: 'Kompilieren - HTML zu SCSS (BEM)',
          initial: settings.compile_scss_bem
        },
        {
          name: 'compile_ts',
          message: 'Kompilieren - Typescript',
          initial: settings.compile_ts
        },        {
          name: 'compile_mode',
          message: 'Kompilieren Modus - Lupcom',
          initial: settings.compile_mode
        },
        {
          name: 'clear_cache',
          message: 'Contao - Clear Cache',
          initial: settings.clear_cache
        },
        {
          name: 'composer_install',
          message: 'DCA - composer install',
          initial: settings.composer_install
        },
        {
          name: 'migrate',
          message: 'DCA - migrate (composer install benötigt)',
          initial: settings.migrate
        },

      ]
    });

    let value = await prompt.run();
    console.log('ANSWERS:', value)
    await module.exports.apply_settings(value);
      
  },
  apply_settings: async function (value) {
    try {
      let json = await fs.readJSON("./contao-info.json")
      json.browsersync = value.browsersync
      json.puppeteer = value.puppeteer
      //json.puppeteer_extras = value.puppeteer_extras
      json.prettier_html = value.prettier_html
      json.prettier_scss = value.prettier_scss
      json.prettier_js = value.prettier_js
      json.compile_mode = value.compile_mode
      json.compile_ts = value.compile_ts
      json.compile_scss = value.compile_scss
      //json.compile_scss_bem = value.compile_scss_bem
      json.fileheaders = value.fileheaders
      json.clear_cache = value.clear_cache
      json.composer_install = value.composer_install
      json.migrate = value.migrate

      fs.writeJSON("./contao-info.json",json,{spaces : 2})

      console.log('json:', json)

    } catch (error) {
      
    }
 
  }

}

