const fs = require("fs-extra");
const credentials = require("../../credentials.json");
const Client = require("ssh2-sftp-client");
const {
  ora_loading_start,
  ora_loading_stop,
} = require("../../core/console/console");

const sftp = new Client();

module.exports = {
  download_dir: async function (folder = "files") {
    const config = {
      host: credentials.SSH_HOST,
      port: credentials.PORT,
      username: credentials.SSH_USERNAME,
      password: credentials.SSH_PASSWORD,
    };

    let src = credentials.SFTP_FILEPATH;
    let dst = "contao-toolset/extra/files-download-ext/download/files";

    try {
      var loading_spinner = await ora_loading_start();
      await sftp.connect(config);

      let path_exists = await fs.pathExists(
        "contao-toolset/extra/files-download-ext/download/files"
      );
      console.log("path_exists:", path_exists);

      if (path_exists) {
        console.log(
          "files-download-ext folder already exists - deleting existing"
            .bgYellow.black
        );
        await module.exports.remove_dir();
      } else {
        console.log("files-download-ext - Creating files folder");
        await module.exports.ensure_dir(
          "contao-toolset/extra/files-download-ext/download/"
        );
      }

      await module.exports.ensure_dir(
        "contao-toolset/extra/files-download-ext/download/"
      );
      var rslt = await sftp.downloadDir(src, dst);
      await sftp.end();

      return rslt;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      ora_loading_stop(loading_spinner);
    }
  },

  list: async function () {
    try {
      console.log(
        credentials.SSH_HOST,
        credentials.PORT,
        credentials.SSH_USERNAME,
        credentials.SSH_PASSWORD
      );

      await sftp.connect({
        host: credentials.SSH_HOST,
        port: credentials.PORT,
        username: credentials.SSH_USERNAME,
        password: credentials.SSH_PASSWORD,
      });

      console.log("connected");
      const data = await sftp.list(credentials.SFTP_FILEPATH);
      console.log(data, "the data info");

      return data;
    } catch (err) {
      console.log(err, "catch error");
      throw err;
    }
  },

  path_exists: async function (f) {
    const exists = await fs.pathExists(f);
    return exists;
  },

  ensure_dir: async function (directory) {
    try {
      await fs.ensureDir(directory);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  remove_dir: async function () {
    try {
      await fs.remove("contao-toolset/extra/files-download-ext/download/files");
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};
