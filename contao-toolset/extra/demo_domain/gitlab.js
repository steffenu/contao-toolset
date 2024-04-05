const { gitlab_ci } = require("./gitlab_ci");
const axios = require("axios");
const { gitlab_token } = require("../../credentials.json");
const {
  get_remote_repo_id,
} = require("../../core/php-versioncheck/php-versioncheck");
const {
  ora_loading_default_start,
  ora_loading_default_stop,
} = require("../../core/console/console");

module.exports = {
  gitlab: async function (input) {
    let spinner = await ora_loading_default_start();
    const projectId = await get_remote_repo_id();
    await ora_loading_default_stop(spinner);

    const is_deploy_keys_enabled = await module.exports.check_deploy_keys(
      projectId
    );
    if (is_deploy_keys_enabled == false) {
      console.log(
        " gitlab ".bgWhite.black +
          " Bitte Deploy Key aktivieren ".bgYellow.black
      );
    } else {
      console.log(" gitlab ".bgWhite.black + " Deploy key aktiv ".white.dim);
    }
    const jobs_enabled = await module.exports.check_jobs_enabled(projectId);
    if (jobs_enabled == false) {
      console.log(
        " gitlab ".bgWhite.black + " Bitte CI / CD einschalten ".bgYellow.black
      );
    } else {
      console.log(" gitlab ".bgWhite.black + " CI / CD aktiv ".white.dim);
    }
    /*     const deploy_key_status = await module.exports.enable_deploy_key(
      371
    ); */
  },
  /*   create_project: async function (input) {
    // Usage
    const accessToken = gitlab_token;
    const projectName = "My New Project";

    try {
      const apiUrl = "https://gitlab.example.com/api/v4/projects";
      const headers = {
        "PRIVATE-TOKEN": accessToken,
      };
      const data = {
        name: projectName,
        initialize_with_readme: false,
      };

      const response = await axios.post(apiUrl, data, {
        headers,
      });

      if (response.status === 201) {
        const createdProject = response.data;
        console.log("New project created successfully:", createdProject);
      } else {
        console.log("Failed to create project:", response.data);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  }, */
  check_deploy_keys: async function (projectId) {
    try {
      // Set up the API endpoint URL and your personal access token
      const apiUrl = "http://gitlab.lupcom.de/api/v4";
      const personalAccessToken = gitlab_token;

      // Specify the project ID or path

      // Set the request headers
      const headers = {
        "PRIVATE-TOKEN": personalAccessToken,
      };

      // Make the API request
      const response = await axios.get(
        `${apiUrl}/projects/${encodeURIComponent(projectId)}/deploy_keys`,
        { headers }
      );

      const deploy_key = response.data;
      //console.log("deploy_key:", deploy_key[0]["title"]); // lupcom

      if (deploy_key[0]["title"] == "lupcom") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      //console.error("An error occurred:", error.message);
      return false;
    }
  },
  check_jobs_enabled: async function (projectId) {
    try {
      // Set up the API endpoint URL and your personal access token
      const apiUrl = "http://gitlab.lupcom.de/api/v4";
      const personalAccessToken = gitlab_token;

      // Set the request headers
      const headers = {
        "PRIVATE-TOKEN": personalAccessToken,
      };

      // Make the API request
      const response = await axios.get(
        `${apiUrl}/projects/${encodeURIComponent(projectId)}?statistics=true`,
        { headers }
      );

      const projectInfo = response.data;
      //console.log("projectInfo:", projectInfo);
      //console.log("jobs_enabled:", projectInfo.jobs_enabled);

      return projectInfo.jobs_enabled;
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  },
  /*   enable_deploy_key: async function (projectId) {
    try {
      // Set up the API endpoint URL and your personal access token
      const apiUrl = "http://gitlab.lupcom.de/api/v4";
      const personalAccessToken = gitlab_token;

      // Specify the project ID or path
      const projectId = "371";

      // Specify the deploy key ID
      const deployKeyId = "2";

      // Set the request headers
      const headers = {
        "PRIVATE-TOKEN": personalAccessToken,
      };

      // Make the API request to enable the deploy key for the project
      await axios.post(
        `${apiUrl}/projects/${encodeURIComponent(
          projectId
        )}/deploy_keys/${encodeURIComponent(deployKeyId)}/enable`,
        null,
        { headers }
      );

      console.log("Deploy key enabled successfully for the project.");
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  }, */
  /*   enable_jobs: async function (projectId) {
    console.log("run");
    try {
      const apiUrl = "http://gitlab.lupcom.de/api/v4";
      const personalAccessToken = gitlab_token;

      // Specify the project ID or path
      const projectId = "371";

      // Set the request headers
      const headers = {
        "PRIVATE-TOKEN": personalAccessToken,
      };

      // Create the request payload to enable jobs
      const payload = {
        jobs_enabled: true,
      };

      // Make the API request to enable jobs for the project
      const response = await axios.put(
        `${apiUrl}/projects/${encodeURIComponent(projectId)}`,
        payload,
        { headers }
      );

      console.log("enable_jobs_response:", response);
      console.log("Jobs enabled successfully for the project.");
      return true;
    } catch (error) {
      console.error("An error occurred:", error.message);
      console.log("error:", error);
      return false;
    }
  }, */
};
