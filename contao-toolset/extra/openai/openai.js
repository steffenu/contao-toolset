const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs-extra");

const credentials = require("../../credentials.json");

const inquirer = require("inquirer");
const inquirerFileTreeSelection = require("inquirer-file-tree-selection-prompt");

const {fcalling,fcalling2} = require("./function_calling")
module.exports = {
  openai: async function () {

    //await fcalling()
    await fcalling2()

    return true;
  },
/*   openai: async function () {
    let filetext = await module.exports.filetree();
    let commented_code = await module.exports.make_request(filetext);
    console.log("commented_code:", commented_code);
    let output = await module.exports.create_ouput_file(commented_code);

    return true;
  },
  make_request: async function (filetext) {
    const configuration = new Configuration({
      organization: credentials.openai_organisation,
      apiKey: credentials.openai_secret_key,
    });
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: `Add a comment on top of each function explaining the function and specify the return value with the proper comment syntax. Give me the code only without explainations . Use this code: n\ ${filetext}  .`,
        },
      ],
    });
    //console.log(completion.data.choices[0].message.content);
    let code = completion.data.choices[0].message.content;
    code = code.replace(/```/g, "");
    if (code.startsWith("javascript")) {
      code = code.slice(10);
    }

    return code;
  },

  filetree: async function () {
    return new Promise(async function (resolve, reject) {
      inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);

      inquirer
        .prompt([
          {
            type: "file-tree-selection",
            name: "file",
            root: "src",
            multiple: false,
          },
        ])
        .then(async (answers) => {
          const filetext = await fs.readFile(answers.file, "utf8");

          resolve(filetext);
        });
    });
  },
  create_ouput_file: async function (commented_code) {
    try {
      fs.writeFileSync("output.js", commented_code, "utf8");
      return true;
      // file written successfully
    } catch (err) {
      console.error(err);
      return false;
    }
  }, */
};
