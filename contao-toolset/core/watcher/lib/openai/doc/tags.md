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