const stylelint = require('stylelint');
const prettyFormatter = require('stylelint-formatter-pretty');

module.exports = {
  lint_scss: async function (path) {
    return new Promise(async function (resolve, reject) {
      const config = {
        customSyntax: 'postcss-scss',
        plugins: ['stylelint-scss'],
        rules: {
          // Add your SCSS-specific stylelint rules here
  
          'max-nesting-depth': 2, // Enforce a maximum nesting depth of 2 levels
          // ... other rules ...
        },
      };

      try {
        const result = await stylelint.lint({
          files: path,
          config,
          formatter: 'string', // Use the default string formatter
        });

        // Output the formatted result using stylelint-formatter-pretty

      console.log(
        "lint_scss".info.bgYellow,
        `- ${path}`.yellow.dim
      );
        console.log(prettyFormatter(result.results));

      } catch (error) {
        console.error(error);
      
      }

      resolve();
    });
  },
};
