const credentials = require("../../credentials.json");
const mysql = require("mysql2");
const { Client } = require("ssh2");

module.exports = {
  ssh_connection_test: async function () {
    return new Promise(async function (resolve, reject) {
      const conn = new Client();
      conn
        .on("error", () => {
          console.error(
            " ssh_connection_test - Error connecting to SSH - Bitte credentials.json und Server Erreichbarkeit Prüfen "
              .black.bgRed.dim
          );
          conn.end();
          resolve("connection_fail");
        })
        .on("ready", () => {
          console.log(" SSH erfolgreich verbunden ".black.bgGreen.dim);
          conn.end();

          resolve("connection_successful");
        })
        .connect({
          host: credentials.SSH_HOST,
          port: credentials.PORT,
          username: credentials.SSH_USERNAME,
          password: credentials.SSH_PASSWORD,
        });
    });
  },
  db_connection_test: async function () {
    return new Promise(async function (resolve, reject) {
      const sshClient = new Client();
      const dbServer = {
        host: credentials.DB_HOST,
        port: 3306,
        user: credentials.DB_USERNAME,
        password: credentials.DB_PASSWORD,
        //database: credentials.DB_DATABASE,
      };
      const tunnelConfig = {
        host: credentials.SSH_HOST,
        port: credentials.PORT,
        username: credentials.SSH_USERNAME,
        password: credentials.SSH_PASSWORD,
      };
      const forwardConfig = {
        srcHost: "127.0.0.1",
        srcPort: 3306,
        dstHost: dbServer.host,
        dstPort: dbServer.port,
      };

      sshClient
        .on("ready", () => {
          console.log(" SSH erfolgreich verbunden ".black.bgGreen.dim);

          // Connection hopping
          sshClient.forwardOut(
            forwardConfig.srcHost,
            forwardConfig.srcPort,
            forwardConfig.dstHost,
            forwardConfig.dstPort,
            (err, stream) => {
              if (err) reject(err);
              const updatedDbServer = {
                ...dbServer,
                stream,
              };
              const connection = mysql.createConnection(updatedDbServer);
              connection.connect((error) => {
                if (error) {
                  //reject(error);

                  resolve(false);
                } else {
                  console.log(
                    " DATENBANK erfolgreich verbunden ".black.bgGreen.dim
                  );

                  connection.end();

                  resolve(true);
                }
              });
            }
          );
        })
        .on("error", () => {
          console.error(
            " db_connection_test - Error connecting to DB - Bitte credentials.json und Server Erreichbarkeit Prüfen "
              .black.bgRed.dim
          );
          try {
            conn.end();
          } catch (error) {}

          resolve(false);
        })
        .connect(tunnelConfig);
    });
  },

  dump_db: async function () {
    return new Promise(async function (resolve, reject) {
      "use strict";
      var gulp = require("gulp");
      var GulpSSH = require("gulp-ssh");
      var fs = require("fs");

      var config = {
        // SSH connection
        host: credentials.SSH_HOST,
        port: credentials.PORT,
        username: credentials.SSH_USERNAME,
        password: credentials.SSH_PASSWORD,

        // MySQL connection
        db_host: credentials.DB_HOST,
        db_name: credentials.DB_DATABASE,
        db_username: credentials.DB_USERNAME,
        db_password: credentials.DB_PASSWORD,
      };

      // Set up SSH connector
      var gulpSSH = new GulpSSH({
        ignoreErrors: true,
        sshConfig: config,
      });

      // Run the mysqldump
      // runs the mysql dump
      // ssh ssh-752788-tmv-demo@lupcom.org "mysqldump -u db503453_249 -p'5ZjtJem+kpyd' -h mysql5.lupcom.org db503453_249 --no-tablespaces"
      // https://stackoverflow.com/a/52179554/11678858
      // 2> /dev/null   to supress "using password can be insecure ..." & Errors in general...
      // another solution would be to create config file : https://stackoverflow.com/a/22933056/11678858
      try {
        gulpSSH
          .exec(
            [
              "mysqldump --opt --default-character-set=latin1 -u " +
                config.db_username +
                " -p'" +
                config.db_password +
                "' -h " +
                config.db_host +
                " " +
                config.db_name +
                " " +
                "2>&1 | grep -v 'Warning: Using a password'",
            ],
            {
              filePath: `${credentials.DB_DATABASE}.sql`,
            }
          )
          // pipes output into local folder
          .pipe(gulp.dest("contao-toolset/extra/db-dump-ext/dumps"));
        resolve(true);
      } catch (error) {
        console.log("!!! Error - Database Import Failed !!!");
        resolve(false);
      }
    });
  },
};
