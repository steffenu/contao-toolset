const gulp = require('gulp');
const eslint = require('gulp-eslint');

module.exports = {
  lint_js: async function (path) {
    return new Promise(async function (resolve, reject) {
      const eslintOptions = {
        "plugins": [
          "snakecasejs"
        ],
        rules: {
          // Add your ESLint rules here
          "snakecasejs/snakecasejs": "warn",
         /*  "no-console": "warn", */
        
          "no-unused-vars": "warn",
          "semi": ["error", "never"],
          // ... other rules ...
        },
        // Additional ESLint configuration options can be defined here
        parserOptions: {
          ecmaVersion: 2017,
          sourceType: "module",
        },
        envs: ["browser", "node"],
      };

      gulp
        .src(path) // Change the file pattern as needed
        .pipe(eslint(eslintOptions))
        .pipe(eslint.format()) // Output the results to the console

      console.log(
        "lint_js".info.bgYellow,
        `- ${path}`.yellow.dim
      );
      resolve(true)




    });
  }

}