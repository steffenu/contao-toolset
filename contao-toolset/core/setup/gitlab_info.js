const { Git } = require("git-interface");
const git = new Git({});
const fs = require("fs-extra");

/*
 * Write the remote gitlab url to credentials config automatically ( used for demo_domain to clone project to ftp)
 */
module.exports = {
  gitlab_info: async function () {
    await module.exports.writeJson_remote_url();
  },

  writeJson_remote_url: async function () {
    try {
      let remote_url = await git.getRemoteUrl("origin");
      //console.log("remote_url:", remote_url);

      let credentials = await fs.readJSON("contao-toolset/credentials.json");

      credentials.LIVE_SERVER_URL = remote_url;

      if (credentials.LIVE_SERVER_URL.includes("contao-toolset.git")) {
        return false;
      }
      await fs.writeJson("contao-toolset/credentials.json", credentials, {
        spaces: 2,
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};
