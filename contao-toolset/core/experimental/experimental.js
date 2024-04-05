const fs = require("fs-extra");
const gitCommitInfo = require("git-commit-info");
const gitRepoIsUpToDate = require("git-repo-is-up-to-date");
const inquirer = require("inquirer");
const inquirerFileTreeSelection = require("inquirer-file-tree-selection-prompt");
const TreePrompt = require("inquirer-tree-prompt");
const SymfonyStyle = require("symfony-style-console").SymfonyStyle;
const boxen = require("boxen");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const cheerio = require("cheerio");

require("@babel/register");
const {
  lighthouse
} = require("./ecma.mjs")



module.exports = {

  insert: async function () {
    const scssString = `
    .block{
      &__icon2 {
        @media (max-width: $medium) {
          padding-bottom: 27px;
        }
        @media (max-width: $medium) {
          padding-bottom: 27px;
        }
        @media (max-width: $medium) {
          padding-bottom: 27px;
        }
      }
      &__icon3{
    
      }
    }
    `;
    
    // Define the new element you want to append
    const newElement = `
    &__element2{
        // Your SCSS code for element2 here
    }
    `;
    
    function insertAfterElement(input, element, contentToAdd) {
        let index = input.indexOf(element);
        if (index === -1) return input;
    
        let openingBraces = 1;
        let position = index + element.length;
    
        while (openingBraces > 0 && position < input.length) {
            if (input[position] === '{') {
                openingBraces++;
            } else if (input[position] === '}') {
                openingBraces--;
            }
            position++;
        }
    
        return input.slice(0, position) + contentToAdd + input.slice(position);
    }
    
    const updatedScss = insertAfterElement(scssString, '&__icon2 {', newElement);
    console.log(updatedScss);
    
  },
  compile6: async function () {
    const scssString = `
.block{
  &__element1{
    &--mod1{}
   }
}
`;

    // Define the new element you want to append
    const newElement = `
&__element2{
    // Your SCSS code for element2 here
}
`;

    // Use a regex pattern to match the entire block of &__element1, including nested items
    const regexPattern = /(&__element1\s*{[\s\S]*?^\s*})/m;

    const updatedScss = scssString.replace(regexPattern, `$1${newElement}`);

    console.log(updatedScss);
  },

  compile5: async function () {
    const fs = require('fs');

    const scssContent = `
    .block {
      color: red;
    
      &__element {
        font-size: 14px;
    
        &--modifier {
          background-color: blue;
        }
        &--modifier2 {
          background-color: blue;
        }
      }
      &__element2 {
        font-size: 14px;
    
        &--modifier2 {
          background-color: blue;
        }
      }
      &__element3 {
        font-size: 14px;
      }
    
      .invalid-class {
        border: 1px solid black;
      }
    }
    `;

    function extractBEM(content) {
      const lines = content.split('\n');
      const output = [];
      let currentBlock = '';
      let currentElement = '';

      for (let line of lines) {
        // Remove any leading/trailing whitespace
        line = line.trim();

        // If it starts with a '.' it's either a block or an unrelated class
        if (line.startsWith('.')) {
          const match = line.match(/^\.(block)/);
          if (match) {
            currentBlock = match[1];
            output.push(currentBlock);
          }
          continue;
        }

        // Check for element (starting with __)
        if (line.startsWith('&__')) {
          const elementMatch = line.match(/^&__(\w+)/);
          if (elementMatch && currentBlock) {
            currentElement = `${currentBlock}__${elementMatch[1]}`;
            output.push(currentElement);
          }
          continue;
        }

        // Check for modifier (starting with --)
        if (line.startsWith('&--')) {
          const modifierMatch = line.match(/^&--(\w+)/);
          if (modifierMatch && currentBlock) {
            if (currentElement) {
              output.push(`${currentElement}--${modifierMatch[1]}`);
            } else {
              output.push(`${currentBlock}--${modifierMatch[1]}`);
            }
          }
          continue;
        }
      }

      return output;
    }

    const bemResults = extractBEM(scssContent);
    console.log(bemResults);





  },
  compile4: async function () {
    const fs = require('fs');

    const scssContent = `
    .block {
      color: red;
    
      &__element {
        font-size: 14px;
    
        &--modifier {
          background-color: blue;
        }
      }
    
      .invalid-class {
        border: 1px solid black;
      }
    }
    `;

    function extractBEM(content) {
      const lines = content.split('\n');
      const output = [];
      let currentBlock = '';

      for (let line of lines) {
        // Remove any leading/trailing whitespace
        line = line.trim();

        // If it starts with a '.' it's either a block or an unrelated class
        if (line.startsWith('.')) {
          const match = line.match(/^\.(block)/);
          if (match) {
            currentBlock = match[1];
            output.push(currentBlock);
          }
          continue;
        }

        // Check for element (starting with __)
        if (line.startsWith('&__')) {
          const elementMatch = line.match(/^&__(\w+)/);
          if (elementMatch && currentBlock) {
            output.push(`${currentBlock}__${elementMatch[1]}`);
          }
          continue;
        }

        // Check for modifier (starting with --)
        if (line.startsWith('&--')) {
          const modifierMatch = line.match(/^&--(\w+)/);
          if (modifierMatch && currentBlock) {
            output.push(`${currentBlock}--${modifierMatch[1]}`);
          }
          continue;
        }
      }

      return output;
    }

    const bemResults = extractBEM(scssContent);
    console.log(bemResults);





  },
  compile3: async function () {
    const fs = require('fs');

    const scssContent = `
    .block {
      color: red;
    
      &__element {
        font-size: 14px;
    
        &--modifier {
          background-color: blue;
        }
      }

      &--modifier2 {
        background-color: blue;
      }

      &__element2 {
        font-size: 14px;
      }
      .invalid-class {
        border: 1px solid black;
      }
    }
    `;

    function extractBEM(content) {
      const lines = content.split('\n');
      const output = [];

      for (let line of lines) {
        // Remove any leading/trailing whitespace
        line = line.trim();

        // If it starts with a '.' it's either a block or an unrelated class
        if (line.startsWith('.')) {
          const match = line.match(/^\.(block)/);
          if (match) {
            output.push(match[1]);
          }
          continue;
        }

        // Check for element (starting with __)
        if (line.startsWith('&__')) {
          const elementMatch = line.match(/^&__(\w+)/);
          if (elementMatch) {
            output.push(elementMatch[1]);
          }
          continue;
        }

        // Check for modifier (starting with --)
        if (line.startsWith('&--')) {
          const modifierMatch = line.match(/^&--(\w+)/);
          if (modifierMatch) {
            output.push(modifierMatch[1]);
          }
          continue;
        }
      }

      return output;
    }

    const bemResults = extractBEM(scssContent);
    console.log(bemResults);




  },
  compile2: async function () {
    const fs = require('fs');

    const scssContent = `
    .block {
      color: red;
    
      &__element {
        font-size: 14px;
    
        &--modifier {
          background-color: blue;
        }
      }
    
      .invalid-class {
        border: 1px solid black;
      }
    }
    `;

    function extractBEM(content) {
      const lines = content.split('\n');
      let block = '';
      const elements = [];
      const modifiers = [];

      for (let line of lines) {
        // Remove any leading/trailing whitespace
        line = line.trim();

        // If it starts with a '.' it's either a block or an unrelated class
        if (line.startsWith('.')) {
          const match = line.match(/^\.(block)/);
          if (match) {
            block = match[1];
          }
          continue;
        }

        // Check for element (starting with __)
        if (line.startsWith('&__')) {
          const elementMatch = line.match(/^&__(\w+)/);
          if (elementMatch) {
            elements.push(elementMatch[1]);
          }
          continue;
        }

        // Check for modifier (starting with --)
        if (line.startsWith('&--')) {
          const modifierMatch = line.match(/^&--(\w+)/);
          if (modifierMatch) {
            modifiers.push(modifierMatch[1]);
          }
          continue;
        }
      }

      return {
        block,
        elements,
        modifiers
      };
    }

    const bemResults = extractBEM(scssContent);
    console.log(bemResults);



  },

  compile: async function () {
    // bem-parser.js
    // bem-parser.js
    function parseBEMStructure() {
      return new Promise(async function (resolve, reject) {
        function parseHTML(html) {
          const $ = cheerio.load(html);
          const classes = new Set();

          $("[class]").each(function () {
            const classList = $(this).attr("class").split(" ");
            classList.forEach((className) => {
              if (className.includes("__") || className.includes("--")) {
                classes.add(className);
              }
            });
          });

          return Array.from(classes);
        }

        function generateSCSS(classes) {
          let scss = "";
          let nestedElements = {};

          classes.forEach((className) => {
            const [block, element, modifier] = className.split(/__|--/);

            if (element && !modifier) {
              if (!nestedElements[block]) {
                nestedElements[block] = [];
              }
              nestedElements[block].push(element);
            }
          });

          for (const [block, elements] of Object.entries(nestedElements)) {
            scss += `.${block} {\n`;
            elements.forEach((element) => {
              scss += `  &__${element} {\n    \n  }\n`;
            });
            scss += "}\n\n";
          }
          return scss;
        }

        // generated html ouptut path
        const htmlFilePath = `src/CustomElementsBundle/Resources/contao/templates/c1_headerbild.html5`;

        // Read HTML file
        let file = fs.readFile(htmlFilePath, "utf8", (err, html) => {
          console.log('html:', html)
          //console.log('html:', html)
          if (err) {
            console.error(err);
            return;
          }

          const parsedClasses = parseHTML(html);
          console.log('parsedClasses:', parsedClasses)
          const scssOutput = generateSCSS(parsedClasses);
          console.log('scssOutput:', scssOutput)

          // Writing the SCSS output to a file
          /*       fs.writeFileSync(
                  `contao-toolset/extra/templates-ext/ouptut/_${templatename}.scss`,
                  scssOutput
                ); */

          console.log("SCSS file generated successfully!");
          resolve(true);
        });
      });

    }





    // Path to the input Sass file
    const inputFile = 'src/CustomElementsBundle/Resources/public/scss/c1_headerbild.scss';

    // Read the content of the input file
    const inputContent = fs.readFileSync(inputFile, 'utf8');
    parseBEMStructure(inputContent)





  },
  try: async function () {
    const fs = require('fs');

    // Read the file
    const content = fs.readFileSync('contao-toolset/apps/project-app/files/tpl/scss/_defaults.scss', 'utf-8');

    // Regular expression to match variables
    const regex = /\$(.*?):(.*?);/g;

    let match;
    let obj = {};

    // Extract all matches and add them to the object
    while ((match = regex.exec(content)) !== null) {
      obj[match[1].trim()] = match[2].trim();
    }

    // Write the object to a JSON file
    fs.writeFileSync('variables.json', JSON.stringify(obj, null, 2));

  },
  cb: async function () {
    const inquirer = require('inquirer');

    const initialSelections = ['option2', 'option3']; // Set your initial values here

    const promptWithNestedSelections = async () => {
      const mainChoices = ['option1', 'option2', 'option3', 'option4', 'option5']; // Add your main selectable items here

      const answers = await inquirer.prompt([{
        type: 'checkbox',
        name: 'selectedItems',
        message: 'Select multiple items:',
        choices: mainChoices,
        default: initialSelections, // Set the initial values here
      }, ]);

      const selectedItems = answers.selectedItems;

      const nestedChoices = {
        option2: ['nestedOption1', 'nestedOption2', 'nestedOption3'],
        option3: ['nestedOptionA', 'nestedOptionB'],
      };

      const followUpPrompts = selectedItems.flatMap((selectedItem) => {
        if (nestedChoices[selectedItem]) {
          return [{
            type: 'checkbox',
            name: selectedItem,
            message: `Select nested items for ${selectedItem}:`,
            choices: nestedChoices[selectedItem],
          }, ];
        }
        return [];
      });

      const nestedAnswers = await inquirer.prompt(followUpPrompts);

      console.log('Selected main items:', selectedItems);
      console.log('Nested selections:', nestedAnswers);
    };

    promptWithNestedSelections();



  },
  pp: async function () {

    const puppeteer = require('puppeteer');
    try {
      // Set the FONTCONFIG_PATH environment variable
      process.env.FONTCONFIG_PATH = '/etc/fonts';

      const browserUrl = 'http://127.0.0.1:9222';

      const browser = await puppeteer.connect({
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Adjust args as needed
        browserURL: browserUrl

      });

      const pages = await browser.pages();

      if (pages.length === 0) {
        console.error('No pages found in the browser.');
        //await browser.close();
        await browser.disconnect();

        return;
      }

      const activePage = pages[0];

      // Execute JavaScript in the page context to clear the cache
      /*     await activePage.evaluate(() => {
            // Hard reload the page, clearing the cache
            window.location.reload(true);
          }); */

      // Enable the necessary DevTools domains
      const client = await activePage.target().createCDPSession();
      await client.send('Network.enable');

      // Clear the browser cache
      await client.send('Network.clearBrowserCache');


      // Reload the active page
      await activePage.reload({
        ignoreCache: true
      });

      await browser.disconnect();

      return true

    } catch (err) {
      console.error('Error:', err);
      return false
    }
  },

  parse: async function () {

    function parseLinesToJSON(input) {
      const lines = input.split('\n');
      const result = [];

      for (const line of lines) {
        const parts = line.trim().split(/\s+/);

        if (parts.length >= 3) {
          const name = parts[0];
          const version = parts[1];
          const success = parts[2];

          result.push({
            name,
            version,
            success,
          });
        }
      }

      return result;
    }

    // Example input string
    const inputString = `
    composer-plugin-api   2.2.0                                                         success                                        
    composer-runtime-api  2.2.2                                                         success                                        
    ext-ctype             *                                                             success provided by symfony/polyfill-ctype     
    ext-curl              7.3.33                                                        success                                        
    ext-dom               20031129                                                      success                                        
    ext-fileinfo          7.3.33                                                        success                                        
    ext-filter            7.3.33                                                        success                                        
    ext-gd                7.3.33                                                        success                                        
    ext-hash              7.3.33                                                        success                                        
    ext-iconv             7.3.33                                                        success                                        
    ext-intl              7.3.33                                                        success                                        
    ext-json              1.7.0                                                         success                                        
    ext-mbstring          *                                                             success provided by symfony/polyfill-mbstring  
    ext-openssl           7.3.33                                                        success                                        
    ext-pcre              7.3.33                                                        success                                        
    ext-pdo               7.3.33                                                        success                                        
    ext-session           7.3.33                                                        success                                        
    ext-simplexml         7.3.33                                                        success                                        
    ext-sodium            7.3.33                                                        success                                        
    ext-tokenizer         7.3.33                                                        success                                        
    ext-xml               7.3.33                                                        success                                        
    ext-xmlreader         7.3.33                                                        success                                        
    ext-zlib              7.3.33                                                        success                                        
    lib-icu               70.1                                                          success                                        
    php                   7.3.33    contao/calendar-bundle requires php (^7.4 || ^8.0)  failed   `;

    const parsedJSON = parseLinesToJSON(inputString);
    console.log(parsedJSON);


  },
  parse2: async function () {
    function parseLinesToJSON(input) {
      const lines = input.split('\n');
      const result = [];

      for (const line of lines) {
        const parts = line.trim().split(/\s{2,}/);

        if (parts.length === 4) {
          const name = parts[0];
          const version = parts[1];
          const success = parts[2];
          const phpVersionMatch = parts[3].match(/\(([^)]+)\)/);
          const phpVersion = phpVersionMatch ? phpVersionMatch[1] : '';

          result.push({
            name,
            version,
            success,
            php_version: phpVersion,
          });
        }
      }

      return result;
    }

    // Example input string
    const inputString = `
    contao/managed-edition                     dev-master  requires  php (^7.1)                                                                                    
ankitpokhrel/tus-php                       v1.3.2      requires  php (^7.1.3)                                                                                  
brick/math                                 0.9.3       requires  php (^7.1 || ^8.0)                                                                            
clue/stream-filter                         v1.6.0      requires  php (>=5.3)                                                                                   
codefog/contao-haste                       4.25.26     requires  php (~7.0 || ~8.0)                                                                            
composer/ca-bundle                         1.3.6       requires  php (^5.3.2 || ^7.0 || ^8.0)                                                                  
contao-community-alliance/composer-plugin  3.1.6       requires  php (^5.6 || ^7.0 || ^8.0)                                                                    
contao-components/installer                1.4.1       requires  php (>=5.6)                                                                                   
contao/calendar-bundle                     4.4.57      requires  php (^5.6 || ^7.0)                                                                            
contao/comments-bundle                     4.4.57      requires  php (^5.6 || ^7.0)                                                                            
contao/core-bundle                         4.4.57      requires  php (^5.6 || ^7.0)                                                                            
contao/faq-bundle                          4.4.57      requires  php (^5.6 || ^7.0)                                                                            
contao/image                               0.3.9       requires  php (^5.6 || ^7.0)                                                                            
contao/imagine-svg                         0.2.3       requires  php (^5.6 || ^7.0)                                                                            
contao/installation-bundle                 4.4.57      requires  php (^5.6 || ^7.0)                                                                            
contao/listing-bundle                      4.4.57      requires  php (^5.6 || ^7.0)                                                                            
contao/manager-bundle                      4.4.57      requires  php (^5.6 || ^7.0)                                                                            
contao/manager-plugin                      2.12.0      requires  php (^7.1 || ^8.0)                                                                            
contao/news-bundle                         4.4.57      requires  php (^5.6 || ^7.0)                                                                            
contao/newsletter-bundle                   4.4.57      requires  php (^5.6 || ^7.0)                                                                            
doctrine/annotations                       1.14.3      requires  php (^7.1 || ^8.0)                                                                            
doctrine/cache                             1.13.0      requires  php (~7.1 || ^8.0)                                                                            
doctrine/collections                       1.8.0       requires  php (^7.1.3 || ^8.0)                                                                          
doctrine/common                            2.13.3      requires  php (^7.1 || ^8.0)                                                                            
doctrine/dbal                              2.13.9      requires  php (^7.1 || ^8)                                                                              
doctrine/deprecations                      v1.1.1      requires  php (^7.1 || ^8.0)                                                                            
doctrine/doctrine-bundle                   1.12.13     requires  php (^7.1 || ^8.0)                                                                            
doctrine/doctrine-cache-bundle             1.4.0       requires  php (^7.1)                                                                                    
doctrine/event-manager                     1.2.0       requires  php (^7.1 || ^8.0)                                                                            
doctrine/inflector                         1.4.4       requires  php (^7.1 || ^8.0)                                                                            
doctrine/lexer                             1.2.3       requires  php (^7.1 || ^8.0)                                                                            
doctrine/persistence                       1.3.8       requires  php (^7.1 || ^8.0)                                                                            
doctrine/reflection                        1.2.3       requires  php (^7.1 || ^8.0)                                                                            
ezyang/htmlpurifier                        v4.16.0     requires  php (~5.6.0 || ~7.0.0 || ~7.1.0 || ~7.2.0 || ~7.3.0 || ~7.4.0 || ~8.0.0 || ~8.1.0 || ~8.2.0)  
fig/link-util                              1.1.2       requires  php (>=5.5.0)   
    `;

    const parsedJSON = parseLinesToJSON(inputString);
    console.log(parsedJSON);


  },
  hotkey: async function () {

    const readline = require('readline');

    // Create a readline interface
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Function to handle hotkey
    function handleHotkey() {
      console.log('Hotkey (Ctrl + Alt + H) pressed!');
    }

    // Set up the terminal to be in "raw" mode to receive each keypress individually
    rl.input.on('keypress', (_, key) => {
      // Check for the hotkey (Ctrl + Alt + H)
      if (key.name === 'h') {
        handleHotkey();
      }
    });

    // Resume the readline interface to receive regular input
    rl.resume();

  },
  hotkey2: async function () {

    const readline = require('readline');

    // Create a readline interface
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Function to handle the specific word being typed
    function handleSpecificWord() {
      console.log('Specific word detected!');
    }

    // Listen for key presses
    rl.on('line', function (input) {
      // Check if the typed input contains the specific word (e.g., "keyword")
      if (input.includes('keyword')) {
        handleSpecificWord();
      } else {
        // Handle other input
        console.log('You typed:', input);
      }
    });

    // Resume the readline interface to receive regular input
    rl.resume();

  },
  hotkey3: async function () {

    const readline = require('readline');

    // Create a readline interface
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Buffer to store typed characters
    let buffer = '';

    // Specific word to detect (e.g., "keyword")
    const specificWord = 'keyword';

    // Function to handle the specific word being typed
    function handleSpecificWord() {
      console.log('Specific word detected!');
      // Clear the buffer after detecting the specific word
      buffer = '';
    }

    // Listen for key presses
    rl.input.on('keypress', (_, key) => {
      if (key && key.ctrl && key.name === 'c') {
        // Handle Ctrl + C to exit the application
        rl.close();
      } else if (key && key.name) {
        // Append the typed character to the buffer
        buffer += key.name;
        // Check if the specific word is detected in the buffer
        if (buffer.includes(specificWord)) {
          handleSpecificWord();
        }
      }
    });

    // Set the terminal to be in "raw" mode to receive each keypress individually
    rl.input.setRawMode(true);
    rl.resume();

  },
  lh: async function () {

    await lighthouse();

  },
  generate_bem_scss: async function () {
    return new Promise(async function (resolve, reject) {
      function parseHTML(html) {
        const $ = cheerio.load(html);
        const classes = new Set();

        $("[class]").each(function () {
          const classList = $(this).attr("class").split(" ");
          classList.forEach((className) => {
            if (className.includes("__") || className.includes("--")) {
              classes.add(className);
            }
          });
        });

        return Array.from(classes);
      }

      function generateSCSS(classes) {
        let scss = "";
        let nestedElements = {};

        classes.forEach((className) => {
          const [block, element, modifier] = className.split(/__|--/);

          if (element && !modifier) {
            if (!nestedElements[block]) {
              nestedElements[block] = [];
            }
            nestedElements[block].push(element);
          }
        });

        for (const [block, elements] of Object.entries(nestedElements)) {
          scss += `.${block} {\n`;
          elements.forEach((element) => {
            scss += `  &__${element} {\n    \n  }\n`;
          });
          scss += "}\n\n";
        }
        return scss;
      }

      // generated html ouptut path
      const htmlFilePath = `src/ce_2_imagetext.html5`;

      // Read HTML file
      let file = fs.readFile(htmlFilePath, "utf8", (err, html) => {
        //console.log('html:', html)
        if (err) {
          console.error(err);
          return;
        }

        const parsedClasses = parseHTML(html);
        const scssOutput = generateSCSS(parsedClasses);

        // Writing the SCSS output to a file
        fs.writeFileSync(`test.scss`, scssOutput);

        console.log("SCSS file generated successfully!");
        resolve(true);
      });
    });
  },
  filetree: async function () {
    return new Promise(async function (resolve, reject) {
      inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);

      inquirer
        .prompt([{
          type: "file-tree-selection",
          name: "file",
          root: "src",
          multiple: false,
        }, ])
        .then(async (answers) => {
          console.log(JSON.stringify(answers));

          const project_php_version = await fs.readFile(answers.file, "utf8");
          console.log("project_php_version:", project_php_version);
        });
      resolve(true);
    });
  },


  puppeteer: async function (foldername) {
    const gulp = require("gulp");
    const puppeteer = require("puppeteer");
    const Jimp = require("jimp");

    puppeteer
      .launch({
        executablePath: "/usr/bin/google-chrome",
        headless: true
      })
      .then(async (browser) => {
        const page = await browser.newPage();

        // Capture mobile screenshot
        //await page.goto("https://nasenbaeren.loc/");

        // Set viewport to mobile dimensions
        const mobileViewport = {
          width: 375, // Replace with desired width
          height: 667, // Replace with desired height
          isMobile: true,
          hasTouch: true,
          deviceScaleFactor: 2, // Adjust device scale factor if needed
        };
        await page.setViewport(mobileViewport);

        // Navigate to the website
        await page.goto("https://lafe-mv.lupcom.info/"); // Replace with the URL of the website you want to capture

        await page.addStyleTag({
          content: "#header { display: none !important; }",
        }); // Replace '.your-navigation-element-class' with the class name of the na

        // Capture screenshot of the specific element
        const elementHandle = await page.$(".imagetext"); // Replace '.your-element-class' with the class name of the desired element
        // Scroll the page to trigger lazy loading
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                resolve();
              }
            }, 100);
          });
        });
        const screenshot = await elementHandle.screenshot({
          path: "mobile.png",
        });

        await browser.close();
        console.log(`Screenshot saved `);
      });

    return true;
  },
  puppeteer2: async function (foldername) {
    const gulp = require("gulp");
    const puppeteer = require("puppeteer");
    const Jimp = require("jimp");

    puppeteer
      .launch({
        executablePath: "/usr/bin/google-chrome",
        headless: true
      })
      .then(async (browser) => {
        const page = await browser.newPage();

        // Capture mobile screenshot
        //await page.goto("https://nasenbaeren.loc/");

        // Set viewport to mobile dimensions
        const mobileViewport = {
          width: 1920, // Replace with desired width
          height: 975, // Replace with desired height
          isMobile: false,
          hasTouch: true,
        };
        await page.setViewport(mobileViewport);

        // Navigate to the website
        await page.goto("https://lafe-mv.lupcom.info/"); // Replace with the URL of the website you want to capture

        await page.addStyleTag({
          content: "#header { display: none !important; }",
        }); // Replace '.your-navigation-element-class' with the class name of the na

        // Capture screenshot of the specific element
        const elementHandle = await page.$(".imagetextsection"); // Replace '.your-element-class' with the class name of the desired element
        // Scroll the page to trigger lazy loading
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                resolve();
              }
            }, 100);
          });
        });
        const screenshot = await elementHandle.screenshot({
          path: "desktop.png",
        });

        //exec(`code desktop.png`);
        //exec(`code -n -r element1.png element.png`);
        //exec(`code -d element1.png element2.png`);
        await browser.close();
        console.log(`Screenshot saved `);
      });

    return true;
  },
  puppeteer3: async function (foldername) {
    const lighthouse = require("lighthouse");
    const chromeLauncher = require("chrome-launcher");
    const chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless"]
    });

    const config = {
      extends: "lighthouse:default",
      settings: {
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
      },
    };

    /*     const config = {
      extends: "lighthouse:default",
      settings: {
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
        emulatedFormFactor: "mobile",
      },
    }; */
    const options = {
      port: chrome.port,
      output: "json",
      ...config,
    };

    const runnerResult = await lighthouse(
      "https://lafe-mv.lupcom.info",
      options
    );
    const lhr = runnerResult.lhr;

    // Access the scores
    const performanceScore = lhr.categories.performance.score * 100;
    const accessibilityScore = lhr.categories.accessibility.score * 100;
    const bestPracticesScore = lhr.categories["best-practices"].score * 100;
    const seoScore = lhr.categories.seo.score * 100;

    // Access the Largest Contentful Paint metric
    const lcpInSeconds =
      lhr.audits["largest-contentful-paint"].numericValue / 1000;

    // Access the First Contentful Paint metric
    const fcpInSeconds =
      lhr.audits["first-contentful-paint"].numericValue / 1000;

    // Access the Time to Interactive metric
    const ttiInSeconds = lhr.audits["interactive"].numericValue / 1000;

    // Access the Cumulative Layout Shift (CLS) score
    const clsScore = lhr.audits["cumulative-layout-shift"].displayValue;

    console.log("Performance score:", performanceScore);
    console.log("Accessibility score:", accessibilityScore);
    console.log("Best practices score:", bestPracticesScore);
    console.log("SEO score:", seoScore);
    console.log("First Contentful Paint (s):", fcpInSeconds);
    console.log("Largest Contentful Paint (s):", lcpInSeconds);
    console.log("Time to Interactive (s):", ttiInSeconds);
    console.log("Cumulative Layout Shift (CLS) score:", clsScore);

    // Generate HTML report

    console.log(htmlReport);

    await chrome.kill();

    return true;
  },
  table: async function (foldername) {
    var prettyjson = require("prettyjson");
    const credential = require("../../credentials.json");

    var data = credential;

    var options = {
      noColor: true,
    };

    console.log(
      prettyjson.render(data, {
        keysColor: "magenta",
        dashColor: "magenta",
        stringColor: "cyan",
        multilineStringColor: "cyan",
      })
    );
    return true;
  },
  npm_install2: async function (foldername) {
    console.log("start");
    /*     console.log("===================================".brightCyan);
    console.log("           Composer Update         ".brightCyan);
    console.log("===================================".brightCyan); */
    const {
      stdout,
      stderr
    } = await exec(`npm i`, {
      cwd: `contao-toolset/apps/project-app/output/test.loc`,
    });
    console.log("end");
    return true;
  },
  experimental_core: async function () {
    return new Promise(async function (resolve, reject) {
      const {
        author,
        message
      } = gitCommitInfo();
      console.log(
        `Letzter Commit:`.info + ` ${author} -`.green,
        `${message}`.brightCyan
      );

      module.exports.is_current_branch_uptodate();
      resolve(true);
    });
  },
  remote_url: async function () {
    const {
      Git
    } = require("git-interface");
    const git = new Git({});
    let remote_url = await git.getRemoteUrl("origin");
    console.log("remote_url:", remote_url);
  },
  bem: async function () {
    // Example SCSS BEM string
    const bemString = `
.block {
  color: red;

  &___element {
    font-size: 14px;

    &--modifier {
      background-color: blue;
    }
  }

  .invalid-class {
    border: 1px solid black;
  }
}
`;

    // Function to parse BEM
    function parseBEM(bemString) {
      const stack = []; // Stack to track nested levels
      const regex =
        /&?\.([a-zA-Z0-9_-]+)(__[a-zA-Z0-9_-]+)?(--[a-zA-Z0-9_-]+)?/g; // Regular expression to match BEM classes

      // Remove line breaks and extra spaces
      bemString = bemString.replace(/\n/g, "").replace(/\s+/g, " ").trim();

      // Find all BEM classes in the string
      const matches = bemString.match(regex);

      if (!matches) {
        console.log("No BEM classes found.");
        return;
      }

      for (const match of matches) {
        const [_, block, element, modifier] = match.split(/\.|__/);

        // Determine the nesting level based on the number of class parts
        const level = (block ? 1 : 0) + (element ? 1 : 0) + (modifier ? 1 : 0);

        if (level === stack.length + 1) {
          // Proper nesting, push the level to the stack
          stack.push(level);
        } else if (level <= stack.length) {
          // Properly nested, remove the levels from the stack
          stack.splice(level - 1);
        } else {
          // Improper nesting
          console.log("Improper nesting detected.");
          return;
        }
      }

      if (stack.length === 0) {
        console.log("Proper nesting detected.");
      } else {
        console.log("Improper nesting detected.");
      }
    }

    // Call the parser function with the SCSS BEM string
    parseBEM(bemString);
  },
  log_symbols: async function () {
    return new Promise(async function (resolve, reject) {
      const logSymbols = require("log-symbols");

      console.log(logSymbols.success, "Finished successfully!");
      // Terminals with Unicode support:     ✔ Finished successfully!
      // Terminals without Unicode support:  √ Finished successfully!
      resolve(true);
    });
  },
  ora: async function () {
    return new Promise(async function (resolve, reject) {
      const ora = require("ora");

      const spinner = ora("Loading unicorns").start();

      setTimeout(() => {
        spinner.color = "yellow";
        spinner.text = "Loading rainbows";
      }, 1000);

      spinner.succeed();
      resolve(true);
    });
  },
  boxen2: async function () {
    return new Promise(async function (resolve, reject) {
      console.log(
        boxen(
          `Contao Toolset`.brightCyan +
          ` celebrates its first major release  \n Gitlab:` +
          `https://gitlab.lupcom.de/dev-env/steffen`.brightCyan +
          ` \n Run ` +
          `gulp info`.green +
          ` to get a list of commands`, {
            padding: 1,
            titleAlignment: "center",
            textAlignment: "center",
            borderColor: "cyan",
          }
        )
      );
      /*
      ┌─────────────┐
      │             │
      │   unicorn   │
      │             │
      └─────────────┘
      */

      console.log(
        boxen("Projekte Erstellen".yellow, {
          borderColor: "cyan",
          padding: 1,
          margin: 1,
          borderStyle: "double",
        })
      );
      /*
      
         ╔═════════════╗
         ║             ║
         ║   unicorn   ║
         ║             ║
         ╚═════════════╝
      
      */

      console.log(
        boxen("dont let mundane task drain your mental energy".yellow, {
          title: "Contao Toolset".brightCyan,
          titleAlignment: "center",
          borderColor: "yellow",
        })
      );
      /*
      ┌────── magical ───────┐
      │unicorns love rainbows│
      └──────────────────────┘
      */
      resolve(true);
    });
  },
  s1: async function () {
    return new Promise(async function (resolve, reject) {
      // Or the more verbose way, in case you use Node.js v4:

      const io = new SymfonyStyle();

      // Put out a stylish title
      io.title("Symfony Style");

      // Similar to `title`, but less showy
      io.section("Subsection title");

      // Equivalent to `writeln`, but doesn't put a line break after
      io.write([
        "Write multiple things without ",
        "a line break between or after them.",
      ]);

      // Put 2 blank lines on the screen.
      // The argument is optional and defaults to 1
      io.newLine(2);

      // `text` blocks get indented by one character.
      io.text("This gets indented by one character.");

      // `comment` blocks are also indented and preceded
      // by a double slash "//"
      io.comment("In case you need additional information.");

      // `block` serves to group content, with a certain styling.
      io.block(
        [
          "This gets indented as well.",
          "Use this to indent a bunch of text next to a keyword.",
        ],
        "INFO",
        "fg=black;bg=blue",
        " i ",
        true
      );

      // `success`, `warning`, `caution` and `error` are really
      // just predefined `block` statements.
      // Doesn't make them less useful though.
      io.success("You've done this correctly.");
      io.warning("Be aware of this problem.");
      io.caution("I really need some attention!");
      io.error("This somehow went wrong.");

      // Create one!
      io.progressStart(10);

      // Advance it!
      io.progressAdvance(6);

      // Set it!
      io.progressSet(3);

      // Finish it!
      io.progressFinish();
      resolve(true);
    });
  },
  i3: async function () {
    return new Promise(async function (resolve, reject) {
      inquirer.registerPrompt("tree", TreePrompt);

      inquirer
        .prompt([{
          type: "tree",
          name: "location",
          message: "Where is my phone?",
          multiple: true,
          tree: [{
              value: "in the house",
              open: true,
              children: [{
                  value: "in the living room",
                  children: ["on the sofa", "on the TV cabinet"],
                },
                {
                  value: "in the bedroom",
                  children: ["under the bedclothes", "on the bedside table"],
                },
                "in the bathroom",
              ],
            },
            {
              value: "in the car",
              children: ["on the dash", "in the compartment", "on the seat"],
            },
          ],
        }, ])
        .then((answers) => {
          console.log(JSON.stringify(answers));
        });
      resolve(true);
    });
  },
  i2: async function () {
    return new Promise(async function (resolve, reject) {
      inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);

      inquirer
        .prompt([{
          type: "file-tree-selection",
          name: "file",
          root: "src",
          multiple: true,
        }, ])
        .then((answers) => {
          console.log(JSON.stringify(answers));
        });
      resolve(true);
    });
  },

  i1: async function () {
    return new Promise(async function (resolve, reject) {
      inquirer.registerPrompt("table", require("../../../index"));

      inquirer
        .prompt([{
          type: "table",
          name: "Entwicklungsumgebung",
          message: "Wähle PHP Version für deine Entwicklungsumgebung",

          columns: [{
              name: "PHP 7.3",
              value: "php73",
            },
            {
              name: "PHP 7.4",
              value: "php74",
            },
            {
              name: "PHP 8.1",
              value: "php81",
            },
            /*             {
              name: "None",
              value: undefined,
            }, */
          ],
          rows: [{
              name: "Entwicklungsumgebung",
              value: 0,
            },
            /*               {
              name: "Tuesday",
              value: 1,
            },
            {
              name: "Wednesday",
              value: 2,
            },
            {
              name: "Thursday",
              value: 3,
            },
            {
              name: "Friday",
              value: 4,
            },
            {
              name: "Saturday",
              value: 5,
            },
            {
              name: "Sunday",
              value: 6,
            }, */
          ],
        }, ])
        .then((answers) => {
          /*
    { workoutPlan:
      [ 'arms', 'legs', 'cardio', undefined, 'legs', 'arms', undefined ] }    
    */
          console.log(answers);
        });
      resolve(true);
    });
  },

  /*
   * Remote Repository
   */
  is_current_branch_uptodate: async function () {
    try {
      // Check if a git repo exactly matches what is in the remote branch
      let repo = await gitRepoIsUpToDate();
      console.log(
        "Starte LazyCommit in Branch:".info,
        `${repo.repoInfo.branch}`.brightCyan
      );
      console.log("Remote Url:".info, `${repo.remoteUrl}`.brightCyan);
      if (repo.isUpToDate) {
        console.log(`${repo.repoInfo.branch}`.verbose + " ist aktuell".success);
      } else {
        console.log(`${repo.errors}`.brightCyan);
      }
      return true;
    } catch (error) {
      console.log("No Remote Repo found".red);
    }
  },
};