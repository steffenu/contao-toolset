/* 
1. Check generated scss
2. if new element is found append it at the appropriate place
3. warn if unused element is found (append unsed to it)
*/
const fs = require("fs-extra");
const cheerio = require("cheerio");
const lib_path = require("path")
const settings = require("../../../../../contao-info.json")
module.exports = {

  /* 
   *  Any new bem class that you add to your html template will also be added to the scss file. 
   */
  bem_html_to_scss: async function (path) {
    let [html_bem_classes,block_element] = await module.exports.get_html_bem_classes(path);
    let [bemResults, scssContent, filepath] = await module.exports.get_scss_bem_classes(path,block_element);
    bemResults = bemResults.filter((item, index) => bemResults.indexOf(item) === index);

    await module.exports.compare_and_append(html_bem_classes, bemResults, scssContent, filepath)

    console.log('scss_bem_classes:', bemResults)
    console.log('html_bem_classes:', html_bem_classes)
  },

  compare_and_append: async function (html_bem_classes, scss_bem_classes, scssContent, filepath) {
    let updated_scss = scssContent;
    let has_new_items = 0
    for (const [index, item] of html_bem_classes.entries()) {
      if (scss_bem_classes.includes(item) == false) {
        console.log("not included", item)
        let prev_item = html_bem_classes[index - 1]

        /* 
        * If there is no previous index dont - 1
        */
        if (prev_item == undefined) {
          prev_item = html_bem_classes[index]
        }
        console.log("prev-item", html_bem_classes[index - 1])

        /* 
         * Section not supported atm . only main bem block
         */
        if (item.includes("section") == false) {
          updated_scss = await module.exports.append_element(item, prev_item, updated_scss)
          has_new_items = has_new_items + 1
        }

      }
    }
    if (has_new_items > 0) {
      await fs.writeFile(filepath, updated_scss, 'utf8');
    }

    return
  },

  get_scss_bem_classes: async function (path,block_element) {
    let filename = lib_path.basename(path)
    let fileNameWithoutExt = lib_path.parse(filename).name; // gets the filename without extension: 'filename'
    //console.log('fileNameWithoutExt:', fileNameWithoutExt)

    let scss_dir = lib_path.dirname(path)
    let filepath

    if (settings.compile_mode == 2) {


      // Get the directory two levels up
      let twoLevelsUp = lib_path.dirname(lib_path.dirname(scss_dir));
      let lupcom_path = twoLevelsUp + "/public/scss/" + fileNameWithoutExt + ".scss"
      filepath = lupcom_path
      //console.log('lupcom_path:', lupcom_path)
    } else {

      // Get the directory two levels up
      let twoLevelsUp = lib_path.dirname(lib_path.dirname(scss_dir));
      let ivo_path = twoLevelsUp + "/public/css/scss/" + "_" + fileNameWithoutExt + ".scss"
      console.log('ivo_path:', ivo_path)
      filepath = ivo_path
    }


    const scssContent = await fs.readFile(filepath, "utf8");


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
          //const match = line.match(/^\.(bildtext)/);
      
          const regex = new RegExp(`^\.(${block_element})`);
          const match = line.match(regex);
          if (match) {
            currentBlock = match[1];
            output.push(currentBlock);
          }
          continue;
        }

        // Check for element (starting with __)
        if (line.startsWith('&__')) {

          const elementMatch = line.match(/^&__(\w+(?:--\w+)?)/);
          
          /* 
          Explanation:

            ^: asserts position at the start of a line.
            &__: matches the &__ characters literally.
            (\w+(?:--\w+)?): This captures the element name and its optional modifier.
            \w+: matches one or more word characters. This will match and capture titlewrapper in your example.
            (?:--\w+)?: This is a non-capturing group for the optional modifier.
            --: matches the -- characters literally.
            \w+: matches one or more word characters.
            ?: makes the entire group optional.
            This will now match and capture the entire titlewrapper--mod in the given example.
          */

          //const elementMatch = line.match(/^&__(\w+)(?:--\w+)?/);
          //console.log('elementMatch:', elementMatch)

          //const elementMatch = line.match(/^&__(\w+)/);
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
    return [bemResults, scssContent, filepath]

  },
  get_html_bem_classes: async function (path) {
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

      // Read HTML file
      let file = fs.readFile(path, "utf8", (err, html) => {
        //console.log('html:', html)
        if (err) {
          console.error(err);
          return;
        }

        const parsedClasses = parseHTML(html);
        const block_element = parsedClasses[0].split("__")[0]
        resolve([parsedClasses,block_element])
      });
    });

  },
  append_element: async function (item, prev_item, scssContent) {

    let item_element = "&__" + item.split("__")[1];
    console.log('item_element:', item_element)
    
    prev_item = "&__" + prev_item.split("__")[1];
    console.log('prev_item:', prev_item)


    // Define the new element you want to append
    const newElement = `
    ${item_element}{

    }`;

    /**
     * Inserts the given newElement string right after the block of the specified element in the SCSS content.
     *
     * @param {string} scssContent - The SCSS content as a string.
     * @param {string} element - The SCSS block (e.g., "&__icon2 {") after which the new content should be inserted.
     * @param {string} newElement - The SCSS content that should be inserted.
     * @returns {string} - Updated SCSS content with the newElement inserted after the specified element block.
     */
    function insertAfterElement(scssContent, element, newElement) {

      // Find the start index of the specified element in the SCSS content.
      let index = scssContent.indexOf(element);

      // If the element is not found, return the original SCSS content unchanged.
      if (index === -1) return scssContent;

      // Initialize a counter for opening braces. As we have found the element, we know 
      // it starts with an opening brace, so we set it to 1.
      let openingBraces = 1;

      // Move the position pointer to the end of the found element string.
      let position = index + element.length;

      // Loop through the SCSS content to find the closing brace for the element's block.
      // This loop can handle nested blocks (e.g., media queries) within the element block.
      while (openingBraces > 0 && position < scssContent.length) {

        // If an opening brace is found, increment the counter.
        if (scssContent[position] === '{') {
          openingBraces++;
        }
        // If a closing brace is found, decrement the counter.
        else if (scssContent[position] === '}') {
          openingBraces--;
        }

        // Move the position pointer to the next character.
        position++;
      }

      // Insert the newElement string right after the closing brace of the element's block.
      // The slice() method is used to split the original SCSS content and insert the new content in between.
      return scssContent.slice(0, position) + newElement + scssContent.slice(position);
    }

    /*     function insertAfterElement(scssContent, element, newElement) {
          let index = scssContent.indexOf(element);
          if (index === -1) return scssContent;
      
          let openingBraces = 1;
          let position = index + element.length;
      
          while (openingBraces > 0 && position < scssContent.length) {
              if (scssContent[position] === '{') {
                  openingBraces++;
              } else if (scssContent[position] === '}') {
                  openingBraces--;
              }
              position++;
          }
      
          return scssContent.slice(0, position) + newElement + scssContent.slice(position);
      } */

    const updatedScss = insertAfterElement(scssContent, `${prev_item} {`, newElement);

    // Use a regex pattern to match the entire block of &__element1, including nested items
    //const regexPattern = /(item_element\s*{[\s\S]*?^\s*})/m;
    /*     const regexPattern = new RegExp(`(${prev_item}\\s*{[\\s\\S]*?^\\s*})`, 'm');
        
        const updatedScss = scssContent.replace(regexPattern, `$1${newElement}`); */
    return updatedScss


  },
}