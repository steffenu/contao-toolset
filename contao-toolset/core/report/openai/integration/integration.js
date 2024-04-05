
module.exports = {
  integration: async function () {
    let filetext = await module.exports.filetree();
    let commented_code = await module.exports.make_request(filetext);
    console.log("commented_code:", commented_code);
    let output = await module.exports.create_ouput_file(commented_code);

    return true;
  },
  smart_data_selection: async function () {
    

    return true;
  },

  /* 
  0. Hello There i can assist with your files , database , testing ,. Ask question , find files , complete tasks
  1. ask what you want 
  2. if gpt can do , it chooses function
  4. prompt opens for confimration
  5 . execute task 
  */


}