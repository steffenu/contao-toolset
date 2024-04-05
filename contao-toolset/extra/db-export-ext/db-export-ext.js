const fs = require("fs-extra");
const credentials = require("../../credentials.json");
const { db_connection_test } = require("../db-dump-ext/db-ext.js");
const { show_databases } = require("../db-import-ext/db-import-ext");
const { abfrage_ja_nein } = require("../../core/prompts/prompts");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { Client } = require("ssh2");

module.exports = {
  db_export_ext: async function () {
    let can_connect_to_remote_db = await db_connection_test();
    console.log("can_connect_to_remote_db:", can_connect_to_remote_db);
    if (can_connect_to_remote_db) {
      let mysql_dump_name = await module.exports.local_mysql_dump();
      console.log("mysql_dump_name:", mysql_dump_name);
      let directory_created = await module.exports.create_remote_directory();
      console.log("directory_created:", directory_created);
      let dump_transfered = await module.exports.transfer_dump_to_remote(
        mysql_dump_name
      );
      console.log("dump_transfered:", dump_transfered);
      let local_dump_created = await module.exports.export_db(mysql_dump_name);
      console.log("local_dump_created:", local_dump_created);
    }
  },

  export_db: async function (mysql_dump_name) {
    return new Promise(async function (resolve, reject) {
      const sshConfig = {
        host: credentials.SSH_HOST,
        port: credentials.PORT,
        username: credentials.SSH_USERNAME,
        password: credentials.SSH_PASSWORD,
      };

      const conn = new Client();

      conn.on("ready", () => {
        console.log("SSH connection established");
        console.log(
          `mysql -u ${credentials.DB_USERNAME} -p'${credentials.DB_PASSWORD}' -h mysql -D ${credentials.DB_DATABASE} < export_dumps/${mysql_dump_name}`
        );
        conn.exec(
          `mysql -u ${credentials.DB_USERNAME} -p'${credentials.DB_PASSWORD}' -h mysql -D ${credentials.DB_DATABASE} < export_dumps/${mysql_dump_name}`,
          (err, stream) => {
            if (err) throw err;

            stream
              .on("close", (code, signal) => {
                console.log("Database import completed");
                conn.end();
                resolve(true);
              })
              .on("data", (data) => {
                console.log(data.toString());
              })
              .stderr.on("data", (data) => {
                console.error(data.toString());
              });
          }
        );
      });

      conn.connect(sshConfig);
    });
  },

  transfer_dump_to_remote: async function (mysql_dump_name) {
    return new Promise(async function (resolve, reject) {
      const localFilePath = `contao-toolset/extra/db-export-ext/export_dumps/${mysql_dump_name}`;
      const remoteHost = credentials.SSH_HOST;
      const remotePort = credentials.PORT;
      const remoteUsername = credentials.SSH_USERNAME;
      const remotePassword = credentials.SSH_PASSWORD;
      const remoteFilePath = `export_dumps/${mysql_dump_name}`;

      const sshClient = new Client();

      sshClient.connect({
        host: remoteHost,
        port: remotePort,
        username: remoteUsername,
        password: remotePassword,
      });

      sshClient.on("ready", () => {
        console.log("Connected to the remote server");
        sshClient.sftp((err, sftp) => {
          if (err) throw err;
          console.log("SFTP session started");
          const remoteStream = sftp.createWriteStream(remoteFilePath);
          const localStream = fs.createReadStream(localFilePath);
          localStream.pipe(remoteStream);
          remoteStream.on("close", () => {
            console.log("File transfer completed");
            sshClient.end();
            resolve(true);
          });
          remoteStream.on("end", () => {
            console.log("SFTP session closed");
          });
          remoteStream.on("error", (err) => {
            console.error("Error during file transfer:", err);
            sshClient.end();
            resolve(false);
          });
        });
      });

      sshClient.on("error", (err) => {
        console.error("SSH connection error:", err);
      });
    });
  },

  create_remote_directory: async function () {

    return new Promise(async function (resolve, reject) {

      const Client = require('ssh2-sftp-client');

      const config = {
        host: credentials.SSH_HOST,
        port: credentials.PORT,
        username: credentials.SSH_USERNAME,
        password: credentials.SSH_PASSWORD,
      };

      let remoteDir = 'export_dumps';
      let client = new Client();

      client.connect(config)
        .then(() => {
          return client.mkdir(remoteDir, true);
        })
        .then(() => {
          client.end();
          resolve(true);
        })
        .catch(err => {
          console.error(err.message);
          resolve(false);
        });
       
    });
  },

  local_mysql_dump: async function () {
    return new Promise(async function (resolve, reject) {
      let databases = await show_databases();
      let selected_db = await abfrage_ja_nein(
        "Wähle Datenbank für Dump aus",
        databases
      );
      let confirmation = await abfrage_ja_nein(
        selected_db["selected"] + " ist das Korrekt ?",
        ["Ja", "Nein"]
      );
      if (confirmation["selected"] == "Ja") {
        try {
          await fs.ensureDir("contao-toolset/extra/db-export-ext/export_dumps");
        } catch (err) {
          console.error(err);
        }
        console.log("🆗 Abfrage bestätigt".info);
        console.log("🆗 Lokaler Dump wird ausgeführt".brightCyan);
        console.log(
          `mysqldump -u root -h localhost:3306 --opt --column-statistics=0 --no-tablespaces --default-character-set=latin1 ${selected_db["selected"]} > ${selected_db["selected"]}.sql`
        );

        await exec(
          `mysqldump -u root -popwer384 -h localhost:3306 --opt --column-statistics=0 --no-tablespaces --default-character-set=latin1 ${selected_db["selected"]} > ${selected_db["selected"]}.sql 2> /dev/null`,
          { cwd: "contao-toolset/extra/db-export-ext/export_dumps" }
        );
      }

      resolve(`${selected_db["selected"]}.sql`);
    });
  },
};
