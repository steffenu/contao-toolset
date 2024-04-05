var prompt = require("gulp-prompt");
const fs = require("fs-extra");
const branchName = require("current-git-branch");
var gulp = require("gulp");
const { Git } = require("git-interface");
const {
  toolset__title,
  toolset__info,
} = require("./contao-toolset/core/console/console");

const git = new Git({});
const { prompt_select } = require("./contao-toolset/core/prompts/prompts");
const { ticketpush } = require("./contao-toolset/core/redmine/redmine");
const {browsersync} = require("./contao-toolset/core/watcher/lib/browsersync/browsersync")

const contao_toolset_conf = "./contao-toolset/contao_toolset.json";

var colors = require("colors");
colors.setTheme({
  success: "green",
  input: "grey",
  info: "blue",
  warn: "yellow",
  error: "red",
  verbose: "magenta",
});

colors.enable();

const {
  is_feature_branch,
  is_hotfix_branch,
} = require("./contao-toolset/core/git/git");

function padTo2Digits(num) {
  return String(num).padStart(2, "0");
}
const date = new Date();
const hoursAndMinutes =
  padTo2Digits(date.getHours()) + ":" + padTo2Digits(date.getMinutes());

async function lazycommit() {
  return new Promise(async function (resolve, reject) {
    if (experimental_core) {
      await experimental_core.experimental_core(); // console output
    }

    if (workflow_switch_branch_core) {
      let new_branch_was_created =
        await workflow_switch_branch_core.workflow_switch_branch_core();
      if (new_branch_was_created == false) {
        console.log(
          "Workflow Branch wurde erstellt. Mache nun deine Änderungen und starte"
            .brightCyan +
            " lazycommit".verbose +
            " erneut :)".brightCyan
        );
        resolve(false);
        return;
      }
    }

    let select_pushmode = await prompt_select("Commit Modus wählen", [
      {
        title: "Nur Commit Message",
        value: "comment",
      },
      {
        title: "Letzte Commit Message wiederholen",
        value: "repeat",
      },
      {
        title: "Redmine Ticket hinzufügen",
        value: "ticket",
      },
      {
        title: "Cleanup",
        value: "push",
      },
    ]);
    if (select_pushmode.value == "comment") {
      await commentpush();
    } else if (select_pushmode.value == "repeat") {
      await repeatpush();
    } else if (select_pushmode.value == "ticket") {
      await ticketpush();
    } else if (select_pushmode.value == "push") {
      await push();
    }

    resolve(true);
  });
}

async function commentpush() {
  return new Promise(async function (resolve, reject) {
    let current_active_branch = branchName(); // false or branch name of process.cwd()

    let check = await php_versioncheck_core.app_check_if_up_to_date();
    if (check == false) {
      return;
    }

    let abfrage_commit_msg = await abfrage_single_input();
    let read = await readJson();
    //console.log("read:", read);
    if (read) {
      await writeJson(abfrage_commit_msg["selected"], read);
      console.log(abfrage_commit_msg["selected"] + " - " + hoursAndMinutes);
    }

    if (abfrage_commit_msg == "") {
      add_commit_push("update", current_active_branch);
    } else {
      add_commit_push(abfrage_commit_msg["selected"], current_active_branch);
      resolve(true);
    }
  });
}

async function push() {
  return new Promise(async function (resolve, reject) {
    let current_active_branch = branchName(); // false or branch name of process.cwd()

    try {
      let check = await php_versioncheck_core.app_check_if_up_to_date();
      if (check == false) {
        return;
      }
    } catch (error) {
      console.log("consider installing > php-versioncheck".info);
    }

    add_commit_push(
      "cleanup files" + " - " + hoursAndMinutes,
      current_active_branch
    );
    resolve("OK");
  });
}
async function repeatpush() {
  return new Promise(async function (resolve, reject) {
    await php_versioncheck_core.app_check_if_up_to_date();

    let read = await readJson();

    if (read.commit_msg) {
      let decision = await abfrage_ja_nein(
        `Repeat commit message:  (## ${read.commit_msg} ## ) ?`
      );
      if (decision["selected"] == "Ja") {
        let current_active_branch = branchName(); // false or branch name of process.cwd()
        add_commit_push("* " + read.commit_msg, current_active_branch);
        resolve(true);
      }
    } else {
      console.log(
        "## no commit message stored - Do commentpush or ticketpush first ##"
      );
      resolve(false);
    }
  });
}
async function abfrage_single_input(message = "") {
  return new Promise(function (resolve, reject) {
    gulp.src("README.md").pipe(
      prompt.prompt(
        {
          type: "input",
          name: "selected",
          message: "Bitte Commit Message eingeben",
        },
        function (res) {
          resolve(res);
        }
      )
    );
  });
}
async function abfrage_ja_nein(message, choices = ["Ja", "Nein"]) {
  return new Promise(function (resolve, reject) {
    return gulp.src("README.md").pipe(
      prompt.prompt(
        {
          type: "list",
          name: "selected",
          message: message,
          choices: choices,
          pageSize: "6",
        },
        (res) => {
          console.log("Result", res);
          resolve(res);
        }
      )
    );
  });
}

async function add_commit_push(message = "update", branch = "main") {
  if (git_core) {
    let accept_many_changes = await git_core.uncommitted_list(); // console output

    if (accept_many_changes) {
      // continue
    } else {
      console.log("Abbruch".red);
      return;
    }
  }

  if (git_core) {
    await git_core.active_branch(); // console output
  }

  await git.add();
  await git.commit(message);
  if (git_core) {
    await git_core.last_changes(); // console output
  }

  // feature branches should not be pushed
  console.log();
  if (
    (await is_feature_branch()) == false &&
    (await is_hotfix_branch()) == false
  ) {
    await git.push();
  } else {
    //console.log("Remember : Feature and Hotfix Branches will not be pushed to remote".verbose);
  }

  if (workflow_merge_core) {
    await workflow_merge_core.workflow_merge_core();
  }
}
async function readJson() {
  try {
    const packageObj = await fs.readJson(
      "./contao-toolset/contao_toolset.json"
    );
    return packageObj;
  } catch (err) {
    //console.error(err);
  }
}
async function writeJson(commit_msg, contao_toolset_conf) {
  try {
    contao_toolset_conf["commit_msg"] = commit_msg;
    let updated_json = contao_toolset_conf;
    //console.log("updated_json:", updated_json);
    await fs.writeJson("./contao-toolset/contao_toolset.json", updated_json);
  } catch (err) {
    console.error(err);
  }
}

exports.abfrage_single_input = abfrage_single_input;
exports.abfrage_ja_nein = abfrage_ja_nein;
exports.add_commit_push = add_commit_push;
exports.readJson = readJson;
exports.writeJson = writeJson;
exports.lazycommit = lazycommit;
exports.commentpush = commentpush;
exports.repeatpush = repeatpush;
exports.push = push;

// workflow_switch_branch_core
try {
  var workflow_switch_branch_core = require("./contao-toolset/core/workflow-switch-branch/workflow-switch-branch.js");
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/core/workflow-switch-branch/workflow-switch-branch.js"),
  };
} catch (error) {
  console.log("✖ develop-branch-switch-ext".input);
}
// workflow-merge
try {
  var workflow_merge_core = require("./contao-toolset/core/workflow-merge/workflow-merge.js");
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/core/workflow-merge/workflow-merge.js"),
  };
} catch (error) {
  console.log("✖ workflow-merge".input);
}
// setup_core
try {
  var setup_core = require("./contao-toolset/core/setup/setup.js");
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/core/setup/setup.js"),
  };
} catch (error) {
  console.log("✖ setup".input);
}
// prompts_core
try {
  var prompts_core = require("./contao-toolset/core/prompts/prompts.js");
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/core/prompts/prompts.js"),
  };
} catch (error) {
  console.log("✖prompts".input);
}
// verify_core
try {
  var verify_core = require("./contao-toolset/core/verify/verify.js");
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/core/verify/verify.js"),
  };
} catch (error) {
  console.log("✖ verify".input);
}
// db_ext (db-dump-ext)
try {
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/extra/db-dump-ext/db-ext.js"),
  };
} catch (error) {
  console.log("✖ db-ext  ".input);
}
// db-import-ext
try {
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/extra/db-import-ext/db-import-ext.js"),
  };
} catch (error) {
  console.log("✖ db-import-ext  ".input);
}
// db-export-ext
try {
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/extra/db-export-ext/db-export-ext.js"),
  };
} catch (error) {
  console.log("error:", error);
  console.log("✖ db-export-ext  ".input);
}
// files_download_ext
try {
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/extra/files-download-ext/files-download-ext.js"),
  };
} catch (error) {
  console.log("✖ files-download-ext".input);
}
// live-git-status-ext
try {
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/extra/live-git-status-ext/live-git-status-ext.js"),
  };
} catch (error) {
  console.log("✖ live-git-status-ext".input);
}
// php-versionswitch-ext
try {
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/extra/php-versionswitch-ext/php-versionswitch-ext.js"),
  };
} catch (error) {
  console.log("✖ php-versionswitch-ext".input);
}
// contao-ext
try {
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/extra/contao-ext/contao-ext.js"),
  };
} catch (error) {
  console.log("✖ contao-ext".input);
}
// php-templates-ext
try {
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/extra/templates-ext/templates-ext.js"),
  };
} catch (error) {
  console.log("✖ templates-ext".input);
}
// openai
try {
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/extra/openai/openai.js"),
  };
} catch (error) {
  console.log('error:', error)
  console.log("✖ openai".input);
}
// demo_domain
try {
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/extra/demo_domain/demo_domain.js"),
  };
} catch (error) {
  console.log("error:", error);
  console.log("✖ demo_domain".input);
}
// php-versioncheck
try {
  var php_versioncheck_core = require("./contao-toolset/core/php-versioncheck/php-versioncheck.js");

  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/core/php-versioncheck/php-versioncheck"),
  };
} catch (error) {
  console.log("✖ php-versioncheck".input);
}


// watcher
try {
  var watcher_core = require("./contao-toolset/core/watcher/watcher.js");

  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/core/watcher/watcher.js"),
  };

} catch (error) {
  console.log('error:', error)
  console.log("✖ watcher".input);
}
// redmine
try {
  var redmine_core = require("./contao-toolset/core/redmine/redmine.js");
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/core/redmine/redmine.js"),
  };
} catch (error) {
  console.log("✖ redmine".input);
}
// help
try {
 require("./contao-toolset/core/help/help.js");
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/core/help/help.js"),
  };
} catch (error) {
  console.log("✖ help".input);
}

// settings
try {
 require("./contao-toolset/core/settings/settings.js");
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/core/settings/settings.js"),
  };
} catch (error) {
  console.log("✖ settings".input);
}
// git
try {
  var git_core = require("./contao-toolset/core/git/git.js");
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/core/git/git.js"),
  };
} catch (error) {
  console.log("✖ git".input);
}
// gitlab-api
try {
  var gitlab_api_core = require("./contao-toolset/core/gitlab-api/gitlab-api-core.js");
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/core/gitlab-api/gitlab-api-core.js"),
  };
} catch (error) {
  console.log("error:", error);
  console.log("✖ gitlab-api".input);
}
// experimental
try {
  var experimental_core = require("./contao-toolset/core/experimental/experimental.js");
  module.exports = {
    ...module.exports,
    ...require("./contao-toolset/core/experimental/experimental.js"),
  };
} catch (error) {
  console.log("error:", error);
  console.log("✖ experimental".input);
}

module.exports = {
  ...module.exports,
  ...require("./contao-toolset/apps/project-app/project-app.js"),
};
module.exports.default = async function () {
  console.log("\n");
  toolset__title();

  if (verify_core) {
    var verified = await verify_core.verify_core();
    var host_entry = await verify_core.verify_hosts_entry();
    var project_foldername = await verify_core.verify_foldername();
  }

  if (setup_core) {
    await setup_core.setup_core(); // using await here
  }

  const settings = require("./contao-info.json");


  if (watcher_core) {
    watcher_core.watcher();
  }

  if (!verified.local_dev_environment) {
    console.log(
      " setup ".bgWhite.black +
        "  Die allgemeine Lupcom Entwicklungsumgebung wird benötigt 🔥 - Bitte das weitere Setup bestätigen für die Installation "
          .bgRed.black
    );
  }
  if (verified.contao_src_folder == false) {
    console.log(
      " setup ".bgWhite.black +
        "  src Ordner der Contao Installation nicht gefunden , contao-toolset somit ohne Funktion "
          .bgRed.black
    );
  }
  if (verified.gitlab_connection == false) {
    console.log(
      " setup ".bgWhite.black +
        " Keine Verbindung zu gitlab.lupcom.de via ssh. Prüfe SSH Schlüssel / Server Status "
          .bgRed.black
    );
  }

  // add livereloading on filechanges
/*   if (browsersync_auto && host_entry && project_foldername.verified) {
    let foldername = require("path").basename(__dirname);
    browsersync_auto.browsersync_auto(foldername);
  } else {
    console.log(
      " setup ".bgWhite.black +
        " host_entry && project_foldername müssen übereinstimmen für browsersync "
          .bgRed.black
    );
  } */

  if (verified.folderpath == false) {
    console.log(
      " setup ".bgWhite.black +
        " Veschiebe Projekt zu volumes/application um verbleibendes Setup zu ermöglichen "
          .bgRed.black
    );
  }
  console.log("\n");
  toolset__info();
  console.log("\n");
};
