const fs = require("fs-extra");
const path = require("path");
const crypto = require("crypto");

module.exports = {
  preset_database: async function () {
    return true;
  },
  /*
   * Gets dump from preset.lupcom.info database ( always getting the latest preset )
   */
  accept_import: async function () {
    return true;
  },
  /*
   * Writes to contao-info.json that preset is being used for this project and prevents further prompts
   */
  write_to_config: async function () {
    return true;
  },
  /*
   * https://symfony.com/doc/current/reference/configuration/framework.html#secret
   */
  generate_app_secret: async function () {
    const byteLength = 32; // the recommended length is around 32 characters. ( symofony docs)
    const appSecret = crypto.randomBytes(byteLength).toString("hex");

    return true;
  },
  generate_env: async function () {
    return true;
  },
  get_dump: async function () {
    return true;
  },
  import_dump: async function () {
    return true;
  },
  /*
   * Reminder for the default login credentials. Default credentials should deleted and replaced with ssh username login.
   */
  login_info: async function () {
    return true;
  },
};
