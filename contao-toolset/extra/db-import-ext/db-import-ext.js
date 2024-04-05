var exec = require("child_process").exec;
const credentials = require("../../credentials.json");
const mysql = require("mysql2");

const { abfrage_ja_nein } = require("../../core/prompts/prompts");

let { db_connection_test, dump_db } = require("../db-dump-ext/db-ext.js");
let { verify_hosts_entry } = require("../../core/verify/verify.js");

module.exports = {
  db_import_ext: async function () {
    return new Promise(async function (resolve, reject) {
      let can_connect_to_remote_db = await db_connection_test();
      if (can_connect_to_remote_db) {
        console.log("🆗 " + "Connect Remote DB".bgBlue.black);
        let dump_success = await dump_db();
        if (dump_success) {
          console.log("🆗 " + "Dump wurde erstellt".bgGreen.black);
          let databases = await module.exports.show_databases();
          let selected_db = await abfrage_ja_nein(
            "Wähle Datenbank für Import aus",
            databases
          );
          let confirmation = await abfrage_ja_nein(
            selected_db["selected"] + " ist das Korrekt ?",
            ["Ja", "Nein"]
          );

          if (confirmation["selected"] == "Ja") {
            let import_succes = await module.exports.import_db(
              selected_db["selected"]
            );
            if (import_succes) {
              console.log("🆗 " + "Import erfolgreich".bgGreen.black);

              let set_domain = await module.exports.set_contao_domain_name(
                selected_db["selected"]
              );

              if (set_domain) {
                console.log("🆗 " + "Domainname gesetzt".bgGreen.black);
              } else {
                console.log("⚠ Set Domain Name".warn);
              }

              resolve(true);
            } else {
              console.log("❌ Import Database".error);
              resolve(false);
            }
          }
        } else {
          console.log("❌ Create Dump".error);
          resolve(false);
        }
      } else {
        console.log("❌ Connect Remote DB".error);
        resolve(false);
      }
    });
  },
  show_databases: async function () {
    return new Promise(async function (resolve, reject) {
      // create the connection to database
      const connection = mysql.createConnection({
        host: credentials.local_db_host,
        port: 3306,
        user: credentials.local_database_user,
        password: credentials.local_database_password,
      });
      // simple query
      connection.query("SHOW DATABASES;", function (err, results, fields) {
        //console.log(results);
        let datbase_arr = [];
        for (const database of results) {
          datbase_arr.push(database.Database);
        }
        resolve(datbase_arr);
        connection.end(); // results contains rows returned by server
        //console.log(fields); // fields contains extra meta data about results, if available
      });
    });
  },
  import_db: async function (schema) {
    console.log(
      "import_db_command:",
      `mysql -u root -p${credentials.local_database_password} -h localhost:3306 ${schema} < ${credentials.DB_DATABASE}.sql`
    );
    return new Promise(async function (resolve, reject) {
      exec(
        `mysql -u root -p${credentials.local_database_password} -h localhost:3306 ${schema} < ${credentials.DB_DATABASE}.sql`,
        {
          cwd: "contao-toolset/extra/db-dump-ext/dumps/",
        },
        function (err, stdout, stderr) {
          if (stdout == undefined || stdout == "") {
            resolve(true);
          } else {
            //console.log('stdout:', stdout)

            resolve(true);
          }
          //console.log(stderr);
        }
      );
    });
  },

  set_contao_domain_name: async function (schema) {
    return new Promise(async function (resolve, reject) {
      let host_entry_exists = await verify_hosts_entry();

      if (host_entry_exists == false) {
        console.log("❌ verify_hosts_entry".warn);
        console.log(
          "Check if your foldername (example: tmv.loc) is present in hosts file"
            .input
        );
        resolve(false);
      }

      const connection = mysql.createConnection({
        host: credentials.local_db_host,
        port: 3306,
        user: credentials.local_database_user,
        password: credentials.local_database_password,
      });
      let path = require("path");
      let basename = path.resolve(__dirname, "..", "..", "..");
      //console.log('basename:', basename)
      basename = path.basename(basename);
      // simple query
      console.log(
        "sql_statement - ",
        `UPDATE ${schema}.tl_page SET dns = '${basename}', useSSL = 0
      WHERE id =1 AND type=root;`
      );
      connection.query(
        `UPDATE ${schema}.tl_page SET dns = '${basename}'
        WHERE id =1 AND type='root';
         ;`,
        function (err, results, fields) {
          if (err) {
            resolve(false);
            connection.end();
          } else {
            resolve(true);
            connection.end();
          }
          // results contains rows returned by server
          //console.log(fields); // fields contains extra meta data about results, if available
        }
      );
    });
  },
  unset_contao_useSSL: async function (schema) {
    return new Promise(async function (resolve, reject) {
      const connection = mysql.createConnection({
        host: credentials.local_db_host,
        port: 3306,
        user: credentials.local_database_user,
        password: credentials.local_database_password,
      });
      let path = require("path");
      let basename = path.resolve(__dirname, "..", "..", "..");
      //console.log('basename:', basename)
      basename = path.basename(basename);
      // simple query
      console.log(
        "sql_statement - ",
        `UPDATE ${schema}.tl_page SET useSSL = 0
      WHERE id =1 AND type=root;`
      );
      connection.query(
        `UPDATE ${schema}.tl_page SET useSSL = 0
        WHERE id =1 AND type='root';
         ;`,
        function (err, results, fields) {
          if (err) {
            resolve(false);
            connection.end();
          } else {
            resolve(true);
            connection.end();
          }
        }
      );
    });
  },

  db_connection_test_local: async function () {
    return new Promise(async function (resolve, reject) {
      const dbServer = {
        host: credentials.local_db_host,
        port: 3306,
        user: credentials.local_database_user,
        password: credentials.local_database_password,
      };
      const connection = mysql.createConnection(dbServer);
      connection.connect((error) => {
        if (error) {
          //reject(error);
          console.log("FAILED TO CONNECT LOCAL DB");
          resolve(false);
        } else {
          console.log("LOCAL DB CONNECTED");
          connection.end();

          resolve(true);
        }
      });
    });
  },
};
