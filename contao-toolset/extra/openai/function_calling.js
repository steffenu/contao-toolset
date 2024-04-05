const {
  Configuration,
  OpenAIApi
} = require("openai");

const credentials = require("../../credentials.json");

const configuration = new Configuration({
  organization: credentials.openai_organisation,
  apiKey: credentials.openai_secret_key,
});
const openai = new OpenAIApi(configuration);



/* FROM OFFICAL DOCS :)

 * Function calling allows you to more reliably get structured data back from the model. 

The basic sequence of steps for function calling is as follows:

Call the model with the user query and a set of functions defined in the functions parameter.
The model can choose to call a function; if so, the content will be a stringified JSON object adhering to your custom schema (note: the model may generate invalid JSON or hallucinate parameters).
Parse the string into JSON in your code, and call your function with the provided arguments if they exist.
Call the model again by appending the function response as a new message, and let the model summarize the results back to the user.
*/

/* 
 * If you want to force the model to call a specific function you can do so by setting function_call: {"name": "<insert-function-name>"}. You can also force the model to generate a user-facing message by setting function_call: "none". Note that the default behavior (function_call: "auto") is for the model to decide on its own whether to call a function and if so which function to call.
 */

/* 
 Specifying a particular function via {"name":\ "my_function"} forces the model to call that function.
*/


module.exports = {


  fcalling: async function (location, unit = "fahrenheit") {


    let data = {

      model: "gpt-3.5-turbo-0613",
      messages: [{
        role: "user",
        content: "What's the current weather in san Francisco?",
      }, ],
      functions: [{
        name: "get_current_weather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"]
            },
          },
          required: ["location"],
        },
      }, ],
      function_call: "auto",
    }

    const completion = await openai.createChatCompletion(data);


    //console.log("completion" , completion)
    console.log("completion-data", completion.data)

    const completionResponse = completion.data.choices[0].message;
    console.log('completionResponse:', completionResponse)



    data.messages.push({
      role: "function",
      name: completionResponse.function_call.name,
      content: JSON.stringify({
        location: "San Francisco",
        temperature: "30",
        unit: "celsius",
        forecast: ["sunny", "windy"],
      }),
    });

    const completion2 = await openai.createChatCompletion(data);

    const completion2Response = completion2.data.choices[0].message;
    console.log('completion2Response:', completion2Response)



  },
  fcalling2: async function (location, unit = "fahrenheit") {
    let test = `
    //##COMMMENT 
    install: async function () {
      return new Promise(async function (resolve, reject) {
  
        let verfified_dev_env = await verify_dev_env();
        if (!verfified_dev_env) {
          let accept = await prompt_toggle("Installation fehlender Docker Umgebung beginnen" + " (benötigt)".red)
  
          if (accept.value) {
              await module.exports.install_env()
          }
        }
  
        resolve(true);
      });
    },
    install_env: async function () {
      return new Promise(async function (resolve, reject) {
  
        await exec("git clone git@gitlab.lupcom.de:dev-env/steffen.git dev-env", {
          cwd: userHomeDir + "/www"
        });
  
        console.log("✅ Entwicklungsumgebung hinzugefügt:".green + 
  
        resolve(true);
      });
    },
  };
    `
    let data = {

      model: "gpt-3.5-turbo-0613",
      messages: [{
        role: "user",
        content: `Create a single function description for the next function that comes after the comment : "//##COMMENT" . Use this code and return only the description back to me: ${test}`,
      }, ],
      functions: [{
        name: "create_function_description",
        description: "Creates a function description for the next function after the comment : //##COMMENT",
        parameters: {
          type: "object",
          properties: {
            function_description: {
              type: "string",
              description: "The Function description with proper Comment Syntax",
            },
          },
          required: ["function_description"],
        },
      }, ],
      function_call: "auto",
    }

    const completion = await openai.createChatCompletion(data);


    //console.log("completion" , completion)
    console.log("completion-data", completion.data)

    const completionResponse = completion.data.choices[0].message;
    console.log('completionResponse:', completionResponse)
  

  },
  get_current_weather: async function (location, unit = "fahrenheit") {
    return JSON.stringify({
      location: "San Francisco",
      temperature: "30",
      unit: "celsius",
      forecast: ["sunny", "windy"],
    });
  },







}