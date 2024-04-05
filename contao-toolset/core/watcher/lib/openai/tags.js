
//COMMENT    (create a comment for the next func below this comment)
//README
/* ##ASK - your question here */
/* ##ERROR - Error here */

const fs = require("fs-extra");
const {
  Configuration,
  OpenAIApi
} = require("openai");
const {
  ora_loading_default_start,
  ora_loading_default_stop,
} = require("../../../../core/console/console");

const credentials = require("../../../../credentials.json");

module.exports = {
  openai_comment: async function (path) {

    const configuration = new Configuration({
      organization: credentials.openai_organisation,
      apiKey: credentials.openai_secret_key,
    });
    const openai = new OpenAIApi(configuration);

    let file = await fs.readFile(path, 'utf8');
    const containsComment = file.includes("//COMMENT");

    if (containsComment == false) {
      return false
    }

    /* match functionname for pattern:  
     * async function functionname  
     */
    //const regex2 = /\/\/\/COMMENT[\s\S]*?\bfunction\s+(\w+)\s*\(/; // function only

    /* match functionname for pattern (module exports) :
     * functionname: async function  
     */

    /* 
    Explanation:

    \/\/\/COMMENT: Matches the //COMMENT literal (Note: \/ is used to escape the forward slashes /).
    \s*: Matches zero or more whitespace characters.
    function: Matches the function keyword.

    \s+: Matches one or more whitespace characters (to allow spaces between function and the function name).
    
    (\w+): Capturing group that matches one or more word characters (function name). The function name will be captured and made available for retrieval.
    */
    const regex0 = /\/\/COMMENT\s*function\s+(\w+)/;
    const matches0 = regex0.exec(file);
    console.log('matches:', matches0)

    if (matches0 && matches0[1]) {
      var functionName = matches0[1];
      console.log("RE-0 Function Name:", functionName);
    } else {
      console.log("RE- 0 - No match found");
    }

    const regex = /\/\/COMMENT\s*(\w+)\s*:\s*async\s*function/;
    const matches = regex.exec(file);
    console.log('matches:', matches)

    if (matches && matches[1]) {
      var functionName = matches[1];
      console.log("RE-1 Function Name:", functionName);
    } else {
      console.log("RE- 1 - No match found");
    }

    const regex2 = /\/\/COMMENT\s*async\s*function\s+(\w+)/;
    const matches2 = regex2.exec(file);
    console.log('matches2:', matches2)

    if (matches2) {
      var functionName = matches2[1];
      console.log("RE-2 Function Name:", functionName);
    } else {
      console.log("RE-2 - No match found.");
    }

    /* both patterns no matches . stop script */
    if (matches0 == null && matches == null && matches2 == null) {
      return
    }

    /* 
    //COMMENT
    add_hosts_file_entry: async function (hostname) {
    */
    /* 
    //COMMENT
    async function add_hosts_file_entry (hostname) {
    */





    let data = {

      model: "gpt-3.5-turbo-0613",
      messages: [{
          "role": "system",
          "content": `You Create a function description summaryfor the given functionname`
        },
        {
          role: "user",
          content: `Functionname ${functionName} , Code :${file}`,
        },
      ],
      functions: [{
        name: "create_function_description",
        description: "Returns a function description for the given functionname",
        parameters: {
          type: "object",
          properties: {
            function_description: {
              type: "string",
              description: "Function description  for the given functionname",
            },
            function_name: {
              type: "string",
              description: "Name of the function",
            },

          },
          required: ["function_description", "function_name"],
        },
      }, ],
      function_call: "auto",
    }

    let spinner = await ora_loading_default_start("OpenAI - creating comment");
    const completion = await openai.createChatCompletion(data);
    await ora_loading_default_stop(spinner);


    //console.log("completion" , completion)
    console.log("completion-data", completion.data)

    const completionResponse = completion.data.choices[0].message;
    console.log('completionResponse:', completionResponse)

    let comment = JSON.parse(completionResponse.function_call.arguments)['function_description']

    file = file.replace(/\/\/COMMENT/g, `/* ${comment} */`);

    await fs.writeFile(path, file, 'utf8');

    return JSON.parse(completionResponse.function_call.arguments)['function_description']
  },

  openai_ask: async function (path) {
    const configuration = new Configuration({
      organization: credentials.openai_organisation,
      apiKey: credentials.openai_secret_key,
    });
    const openai = new OpenAIApi(configuration);

    let file = await fs.readFile(path, 'utf8');
    const containsComment = file.includes("/* ##ASK");


    if (containsComment == false) {
      return false
    }

    const regex = /\/\*\s*##ASK\s*([\s\S]*?)\s*\*\//;
    const match = regex.exec(file);

    if (match) {
      var capturedText = match[1].trim();
      console.log("Captured Text:");
      console.log(capturedText);
    } else {
      console.log("No match found.");
    }


    let data = {

      model: "gpt-3.5-turbo-0613",
      messages: [{
          "role": "system",
          "content": `You are a helpful assistent`
        },
        {
          role: "user",
          content: `${capturedText}`,
        },
      ],
    }

    let spinner = await ora_loading_default_start("OpenAI - creating code");
    const completion = await openai.createChatCompletion(data);
    await ora_loading_default_stop(spinner, "OpenAI - code generated");


    //console.log("completion" , completion)
    //console.log("completion-data", completion.data)

    const completionResponse = completion.data.choices[0].message;
    //console.log('completionResponse:', completionResponse)
    /* ##ASK 
    adasda */
    file = file.replace(/\/\*\s*##ASK\s*([\s\S]*?)\s*\*\//, `/* ${completionResponse.content} */`);

    await fs.writeFile(path, file);

    return
  },

  openai_readme: async function (path) {


    const configuration = new Configuration({
      organization: credentials.openai_organisation,
      apiKey: credentials.openai_secret_key,
    });
    const openai = new OpenAIApi(configuration);

    let file = await fs.readFile(path, 'utf8');

    const containsComment = file.includes("//README");

    if (containsComment == false) {
      return false
    }

    let data = {

      model: "gpt-3.5-turbo-0613",
      messages: [{
          "role": "system",
          "content": `You create a summary of the given file. You write in markdown format. Create the summary in the following format :

          # Overview

          (highlighted) > Summary of what the file does in general.

          (bullepoints): 
          - \`functio_name\`: function_description
          - \`functio_name\`: function_description
          `
        },
        {
          role: "user",
          content: `Create a summary of the given file :${file}`,
        },
      ],
      functions: [{
        name: "create_summary_markdown",
        description: "Returns a summary written in markdown format",
        parameters: {
          type: "object",
          properties: {
            readme: {
              type: "string",
              description: "The summary content. written in markdown format",
            },
  
          },
          required: ["readme"],
        },
      }, ],
      function_call: "none",
    }

    let spinner = await ora_loading_default_start("OpenAI - creating readme");
    const completion = await openai.createChatCompletion(data);
    await ora_loading_default_stop(spinner,"OpenAI - readme generated");


    //console.log("completion" , completion)
    //console.log("completion-data", completion.data)

    const completionResponse = completion.data.choices[0].message;
    //console.log('completionResponse:', completionResponse)

    const directoryPath = require("path").dirname(path);
    const filename = require("path").parse(path).name;
    const file_ext = ".md"
    let readmepath = directoryPath + "/doc/" + filename + file_ext ;
    console.log('readmepath:', readmepath)

    await fs.ensureDir(directoryPath + "/doc");
    await fs.writeFile(readmepath, completionResponse.content);

    // REMOVE THE ///README comment
    file = file.replace(/\/\/README/g, ``);
    await fs.writeFile(path, file, 'utf8');

    return
  },

}