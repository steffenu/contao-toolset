const gulp = require("gulp");
const replace = require("gulp-replace");
const header = require("gulp-header");
const config = require("../../../../credentials.json");

module.exports = {
  fileheader: async function (path) {
    return new Promise(async function (resolve, reject) {

    function getCurrentDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }


    const author = "Your Name";
    const currentDate = getCurrentDate();

    const newHeaderText = `/***
  change date : ${currentDate} 
  changed by : ${config.AUTHOR} 
***/

`;
     gulp
      .src(path, {
        base: "./"
      })
      .pipe(replace(/\/\*\*\*\n([\s\S]*?)\n\*\*\*\/\n\n/, ""))
      .pipe(header(newHeaderText))
      .pipe(gulp.dest("./"))
      .on("end", async () => {
        resolve(true);
        console.log(
          " fileheader ".bgGrey.white,
          ` added`.brightCyan
        );
      });
    });
  },
  
};