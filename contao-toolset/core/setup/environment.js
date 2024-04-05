const fs = require("fs-extra");

module.exports = {

  current_root_foldername: async function () {
    return new Promise(function (resolve, reject) {
      let path = require("path");
      let basename = path.resolve(__dirname, '..', '..', "..");
      //basename = path.basename(basename);
      resolve(basename);
    });
  },
  current_dev_env: async function () {
    return new Promise(function (resolve, reject) {
      let path = require("path");
      let basename = path.resolve(__dirname, '..', '..', ".." , '..', '..', "..");
      //basename = path.basename(basename);
      resolve(basename);
    });
  },

};