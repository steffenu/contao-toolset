const fs = require("fs-extra");
 require('../prompts/prompts');
 const axios = require("axios");

 const { Gitlab } = require('gitlab');
 const gitRepoIsUpToDate = require("git-repo-is-up-to-date");

 const {gitlab_token} = require("../../credentials.json");

 const api = new Gitlab({
  host: 'http://gitlab.lupcom.de',
  token: gitlab_token,
});


module.exports = {

  gitlab_api_core: async function () {
    return new Promise(async function (resolve, reject) {

      let response = await module.exports.repo();
      console.log('response:', response)

      resolve(true);
    });
  },

  /* 
  * Remote Repository
  */
    repo: async function () {
      // Check if a git repo exactly matches what is in the remote branch
      let repo = await gitRepoIsUpToDate();
      return repo
    },

  /* 
  * Users
  */
  users: async function () {

    let users = await api.Users.all();
    return users
  },
    /* 
  * Projects
  */
  projects: async function () {
    let projects = await api.Projects.all()
     return projects
  },  

  /* 
  * Groups
  */
  groups: async function () {
    let groups = await api.Groups.all()
    return groups
  },

  /* 
  * Commits
  */
  commits: async function (project_id ,per_page = 3) {
     const endpoint = `/projects/${project_id}/repository/commits`;
     const perpage = `&per_page=${per_page}`

     let url =
     `http://gitlab.lupcom.de/api/v4${endpoint}?private_token=${gitlab_token}`+perpage;

   try {
     const response = await axios.get(url);
     console.log('response:', response.data)
     return response.data;
   } catch (error) {
     console.error(error);
   }
  },

  /* 
  * Pipeline
  */
  latest_pipeline: async function (project_id) {
    const endpoint = `/projects/${project_id}/pipelines/latest`;

    let url =
    `http://gitlab.lupcom.de/api/v4${endpoint}?private_token=${gitlab_token}`;

    try {
      const response = await axios.get(url);
      console.log('response:', response.data)

      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  retry_pipeline: async function (project_id, pipeline_id) {

    const endpoint = `/projects/${project_id}/pipelines/${pipeline_id}/retry`;

    let url =
      `http://gitlab.lupcom.de/api/v4${endpoint}?private_token=${gitlab_token}`;
    try {
      const response = await axios.get(url);
      console.log('response:', response.data)
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};


