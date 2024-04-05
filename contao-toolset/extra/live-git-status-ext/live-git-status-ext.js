const credentials = require("../../credentials.json");
const { Client } = require("ssh2");

module.exports = {
  live_git_status_ext: async function () {
    try {
      const conn = new Client();

      conn.on("ready", () => {
        conn.exec(
          `cd ${credentials.LIVE_SERVER_CONTAO_PATH} && git status`,
          (err, stream) => {
            if (err) throw err;

            stream
              .on("close", (code, signal) => {
                conn.end();
                resolve();
              })
              .on("data", (data) => {
                console.log(`${data}`.info);
              })
              .stderr.on("data", (data) => {
                console.log("STDERR: " + data);
              });
          }
        );
      });

      conn.on("error", (err) => {
        console.error(
          "live_git_status_ext - Error connecting to SSH - Please check credentials.json and server accessibility"
            .black.bgRed.dim
        );
        return false;
      });

      conn.connect({
        host: credentials.SSH_HOST,
        port: credentials.PORT,
        username: credentials.SSH_USERNAME,
        password: credentials.SSH_PASSWORD,
      });
    } catch (error) {
      console.log("live_git_status_ext - Anmeldung Fehlgeschlagen".error);
    }
  },
};
