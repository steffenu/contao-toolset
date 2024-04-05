const axios = require("axios");
require("dotenv").config();

function get_current_weather(location, unit = "fahrenheit") {
  return JSON.stringify({
    location: location,
    temperature: "30",
    unit: unit,
    forecast: ["sunny", "windy"],
  });
}

function get_clothing_recommendations(temperature) {
  let recommendation =
    temperature < 60 ? "warm clothing colourful" : "light clothing tye-dye";
  return JSON.stringify({ recommendation: recommendation });
}

async function run_conversation() {
  const baseURL = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + process.env.OPENAI_API_KEY,
  };
  let data = {
    messages: [
      {
        role: "user",
        content:
          "What's the weather like in Boston in fahrenheit and based on the temperature what should I wear?",
      },
    ],
    model: "gpt-3.5-turbo-0613",
    functions: [
      {
        name: "get_current_weather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["location"],
        },
      },
      {
        name: "get_clothing_recommendations",
        description: "Get clothing recommendation based on temperature",
        parameters: {
          type: "object",
          properties: {
            temperature: {
              type: "string",
              description: "The current temperature",
            },
          },
          required: ["temperature"],
        },
      },
    ],
    function_call: "auto",
  };

  try {
    console.log(`Sending initial request to OpenAI API...`);
    let response = await axios.post(baseURL, data, { headers });
    response = response.data;

    let executedFunctions = {};

    while (
      response.choices[0].message.function_call &&
      response.choices[0].finish_reason !== "stop"
    ) {
      let message = response.choices[0].message;
      const function_name = message.function_call.name;

      if (executedFunctions[function_name]) {
        break;
      }

      let function_response = "";
      switch (function_name) {
        case "get_current_weather":
          let weatherArgs = JSON.parse(message.function_call.arguments);
          function_response = get_current_weather(
            weatherArgs.location,
            weatherArgs.unit
          );
          break;
        case "get_clothing_recommendations":
          let recommendationArgs = JSON.parse(message.function_call.arguments);
          function_response = get_clothing_recommendations(
            recommendationArgs.temperature
          );
          break;
        default:
          throw new Error(`Unsupported function: ${function_name}`);
      }

      executedFunctions[function_name] = true;

      data.messages.push({
        role: "function",
        name: function_name,
        content: function_response,
      });

      console.log(`Sending request to OpenAI with ${function_name} response...`);
      response = await axios.post(baseURL, data, { headers });
      response = response.data;
    }

    response = await axios.post(baseURL, data, { headers });
    response = response.data;

    return response;
  } catch (error) {
    console.error("Error:", error);
  }
}

run_conversation()
  .then((response) => {
    console.log(response.choices[0].message.content);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

