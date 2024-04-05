const axios = require("axios");
const credentials = require("../../credentials.json");
//const { Client } = require("ssh2");
const Client = require("ssh2-sftp-client");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  /*
   * Create , Copy , Clone folders and files to the FTP Server
   */
  ftp: async function (input) {
    const html_folder_exists = await module.exports.check_html_folder_exists();

    if (html_folder_exists == false) {
      await module.exports.create_html_folder();
    }

    const ssh_folder_exists = await module.exports.check_ssh_folder_exists();

    if (ssh_folder_exists == false) {
      await module.exports.create_ssh_folder();
    }

    const copy_ssh = await module.exports.copy_ssh_keys();
   

    if (copy_ssh) {
      await module.exports.chmod_600();
    }
   

    return true;
  },

  check_html_folder_exists: async function (input) {
    return new Promise(async function (resolve, reject) {
      const config = {
        host: credentials.SSH_HOST,
        port: credentials.PORT,
        username: credentials.SSH_USERNAME,
        password: credentials.SSH_PASSWORD,
      };

      const remoteDirectory = "html";

      const sftp = new Client();

      sftp
        .connect(config)
        .then(() => {
          return sftp.exists(remoteDirectory);
        })
        .then((exists) => {
          if (exists) {
            console.log(
              " check_html_folder_exists ".bgWhite.black +
                " html Ordner existiert ".white.dim
            );
            resolve(true);
          } else {
            console.log(
              " check_html_folder_exists ".bgWhite.black +
                " html Ordner existiert nicht ".bgYellow.black
            );
            resolve(false);
          }
          sftp.end();
        })
        .catch((err) => {
          console.error("Error:", err.message);
          sftp.end();
        });
    });
  },
  create_html_folder: async function (input) {
    return new Promise(async function (resolve, reject) {
      /*  */

      const config = {
        host: credentials.SSH_HOST,
        port: credentials.PORT,
        username: credentials.SSH_USERNAME,
        password: credentials.SSH_PASSWORD,
      };

      let remoteDir = "html";
      let client = new Client();

      client
        .connect(config)
        .then(() => {
          return client.mkdir(remoteDir, true);
        })
        .then(() => {
          client.end();
          resolve(true);
          console.log(
            " create_html_folder ".bgWhite.black +
              " html ordner erstellt ".bgGreen.black
          );
        })
        .catch((err) => {
          console.error(err.message);
          resolve(false);
          console.log(
            " create_html_folder ".bgWhite.black +
              " html ordner konnte nicht erstellt werden ".bgRed.black
          );
        });
    });
  },

  check_ssh_folder_exists: async function (input) {
    return new Promise(async function (resolve, reject) {
      const Client = require("ssh2").Client;

      const sshConfig = {
        host: credentials.SSH_HOST,
        port: credentials.PORT,
        username: credentials.SSH_USERNAME,
        password: credentials.SSH_PASSWORD,
      };

      const sshClient = new Client();

      sshClient
        .on("ready", () => {
          sshClient.sftp((error, sftp) => {
            if (error) {
              console.error("Failed to establish SFTP connection:", error);
              sshClient.end();
              return;
            }

            const folderPath = ".ssh";

            sftp.stat(folderPath, (error, stats) => {
              if (error) {
                if (error.code === 2) {
                  console.log(
                    " check_ssh_folder_exists ".bgWhite.black +
                      " ssh Ordner existiert nicht ".bgYellow.black
                  );
                  resolve(false);

                  sftp.end(); 
                  sshClient.end(); 
                } else {
                  console.error(
                    "Failed to retrieve folder information:",
                    error
                  );
                  resolve(false);

                  sftp.end(); 
                  sshClient.end(); 
                }
              } else {
                if (stats.isDirectory()) {
                  console.log(
                    " check_ssh_folder_exists ".bgWhite.black +
                      " ssh Ordner existiert ".white.dim
                  );
                  resolve(true);

                  sftp.end(); 
                  sshClient.end(); 
                } else {
                  console.log(".ssh is not a folder");
                  resolve(false);

                  sftp.end(); 
                  sshClient.end(); 
                }
              }
            });
          });
        })
        .connect(sshConfig);
    });
  },
  create_ssh_folder: async function (input) {
    return new Promise(async function (resolve, reject) {
      const Client = require("ssh2").Client;

      const sshConfig = {
        host: credentials.SSH_HOST,
        port: credentials.PORT,
        username: credentials.SSH_USERNAME,
        password: credentials.SSH_PASSWORD,
      };

      const sshClient = new Client();

      sshClient
        .on("ready", () => {
          sshClient.sftp((error, sftp) => {
            if (error) {
              console.error("Failed to establish SFTP connection:", error);
              sshClient.end();
              resolve(false);
            }

            const hiddenFolderPath = ".ssh";

            sftp.mkdir(hiddenFolderPath, (error) => {
              if (error) {
                console.error("Failed to create hidden folder:", error);
                resolve(false);
              } else {
                console.log(
                  " create_ssh_folder ".bgWhite.black +
                    " ssh Ordner erstellt ".bgGreen.black
                );
                resolve(true);
              }

              sftp.end(); // Disconnect the SFTP session
              sshClient.end(); // Disconnect the SSH session
            });
          });
        })
        .connect(sshConfig);
    });
  },

  /*
   * Upload a directory
   */
  copy_ssh_keys:async function () {
    return new Promise(async function (resolve, reject) {

    const fs = require('fs');
    const path = require('path');
    const { Client } = require('ssh2');
    
    const sshConfig = {
      host: credentials.SSH_HOST,
      port: credentials.PORT,
      username: credentials.SSH_USERNAME,
      password: credentials.SSH_PASSWORD,
    };
    
    const localDir = 'contao-toolset/extra/demo_domain/.ssh';
    const remoteDir = '.ssh';
    
    const sshClient = new Client();
    sshClient.on('ready', () => {
      console.log('SSH connection established.');
    
      sshClient.sftp((err, sftp) => {
        if (err) {
          console.error('SFTP session error:', err);
          sshClient.end();
          resolve(false)
        }
    
        console.log('SFTP session established.');
    
        fs.readdir(localDir, (err, files) => {
          if (err) {
            console.error('Local directory read error:', err);
            sshClient.end();
            resolve(false)
          }
    
          files.forEach(file => {
            const localPath = path.join(localDir, file);
            const remotePath = path.join(remoteDir, file);
    
            sftp.fastPut(localPath, remotePath, (err) => {
              if (err) {
                console.error('File upload error:', err);
              } else {
                console.log(`File uploaded: ${file}`);
              }
    
              if (files.indexOf(file) === files.length - 1) {
                sftp.end();
                sshClient.end();
                console.log('Upload completed.');
                resolve(true)
              }
            });
          });
        });
      });
    });
    
    sshClient.connect(sshConfig);
  });
    
  },
  chmod_600: async function (input) {
    return new Promise(async function (resolve, reject) {

    const Client = require('ssh2').Client;
    const SftpClient = require('ssh2-sftp-client');
    
    const config = {
      host: credentials.SSH_HOST,
      port: credentials.PORT,
      username: credentials.SSH_USERNAME,
      password: credentials.SSH_PASSWORD,
    };
    
    const directoryPath = '.ssh';
    
    const client = new Client();
    
    client
      .on('ready', function () {
        console.log('SSH client connected');
    
        const sftp = new SftpClient();
    
        sftp
          .connect(config)
          .then(() => {
            return sftp.list(directoryPath);
          })
          .then((files) => {
            const promises = files.map((file) => {
              if (file.type === '-') {
                // Only modify regular files
                const filePath = `${directoryPath}/${file.name}`;
                return sftp.chmod(filePath, 0o600);
              }
            });
    
            return Promise.all(promises);
          })
          .then(() => {
            console.log('Permissions changed successfully');
            sftp.end();
            client.end();
            resolve(true)
          })
          .catch((err) => {
            console.error('Error:', err.message);
            sftp.end();
            client.end();
            resolve(false)
          });
      })
      .connect(config);
    });
  },
  /*
   * Upload a file
   */
  copy_env_file: async function (input) {
    return new Promise(async function (resolve, reject) {
      /*  */

      const config = {
        host: "your-hostname",
        port: "your-port",
        username: "your-username",
        password: "your-password",
      };

      const localFilePath = "/path/to/local/file.txt";
      const remoteFilePath = "/path/to/remote/file.txt";

      const sftp = new Client();

      sftp
        .connect(config)
        .then(() => {
          console.log(
            " demo_domain ".bgWhite.black + " Verbindung hergestellt ".white.dim
          );

          const localFileData = fs.readFileSync(localFilePath);
          return sftp.put(localFileData, remoteFilePath);
        })
        .then(() => {
          console.log("File transferred successfully");
          sftp.end();
        })
        .catch((err) => {
          console.error("Error:", err.message);
          sftp.end();
        });
    });
  },
  clone_project: async function (input) {
    return new Promise(async function (resolve, reject) {
      /*  */
      /* Choice create new project via gitlab api or use existing one */
      try {
        const conn = new Client();
        conn
          .on("ready", () => {
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
          })
          .connect({
            host: credentials.SSH_HOST,
            port: credentials.PORT,
            username: credentials.SSH_USERNAME,
            password: credentials.SSH_PASSWORD,
          });

        conn.on("error", (err) => {
          console.error(
            " live_git_status_ext - Error connecting to SSH - Bitte credentials.json und Server Erreichbarkeit Prüfen "
              .black.bgRed.dim
          );
          resolve(false);
          // Handle the error as per your requirements
        });
      } catch (error) {
        console.log("live_git_status_ext - Anmeldung Fehlgeschlagen".error);
      }
    });
  },
  install_project: async function (input) {
    return new Promise(async function (resolve, reject) {
      /*  */
      try {
        const conn = new Client();
        conn
          .on("ready", () => {
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
          })
          .connect({
            host: credentials.SSH_HOST,
            port: credentials.PORT,
            username: credentials.SSH_USERNAME,
            password: credentials.SSH_PASSWORD,
          });

        conn.on("error", (err) => {
          console.error(
            " live_git_status_ext - Error connecting to SSH - Bitte credentials.json und Server Erreichbarkeit Prüfen "
              .black.bgRed.dim
          );
          resolve(false);
          // Handle the error as per your requirements
        });
      } catch (error) {
        console.log("live_git_status_ext - Anmeldung Fehlgeschlagen".error);
      }
    });
  },
  /*
   * Enable the setting for the new project
   */

  /*
   * Enable the setting for the new project
   */

  /*
   * Export your local database and import it into the new server
   */
  export_db: async function (input) {
    return new Promise(async function (resolve, reject) {
      /* Sicherheitsabfragen und Backup Live */
    });
  },
};
