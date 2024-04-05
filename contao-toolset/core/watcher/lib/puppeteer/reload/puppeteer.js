/* 
Page Navigation: You can navigate to different URLs, go back and forward, and wait for specific events before proceeding.

Element Interaction: Puppeteer lets you interact with elements on the page, such as clicking buttons, filling out forms, typing text, selecting options, etc.

Screenshots and PDF Generation: You can capture screenshots of web pages and generate PDF files from web content.

Network Monitoring: Puppeteer allows you to monitor network requests and responses, intercept and modify requests, simulate slow network conditions, etc.

Headless Browser Interaction: You can emulate mobile devices, set user agents, and control the viewport for responsive web design testing.

Authentication Handling: Puppeteer can handle HTTP basic/digest authentication, client certificates, and other authentication mechanisms.

Cookies and Local Storage: Puppeteer allows you to manage cookies and local storage data in the browser context.

Error Handling: You can catch and handle various types of errors and exceptions that occur during navigation and interaction.

Event Listening: Puppeteer supports listening to various page events, such as page load, navigation, dialog opening, etc.

Emulate Geolocation and Permissions: You can emulate geolocation and control permissions like camera, microphone, etc.

Evaluate JavaScript on the Page: Puppeteer allows you to run custom JavaScript code in the context of the page and retrieve the results.

Interact with Pop-up Dialogs: Puppeteer can handle pop-up dialogs like alert, confirm, and prompt.

Frame and iFrame Interaction: You can interact with elements inside iframes and frames on a web page.

Performance Metrics: Puppeteer provides access to performance-related metrics like load times, resource timings, etc.

Tracing and Profiling: You can perform tracing and profiling to analyze page performance.
*/


const {
  verify_foldername
} = require("../../../../verify/verify");

const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports = {
  /* 
   * Clears cache by connecting to active browser (debug flags required) - 
   * google-chrome --remote-debugging-port=9222
   * returns false if cant connect , then browsersync is being used for reloading without cache clear
   */
  puppeteer_reload: async function () {

    const puppeteer = require('puppeteer');
    try {

      const browserUrl = 'http://127.0.0.1:9222';

      const browser = await puppeteer.connect({

        defaultViewport: null,
        browserURL: browserUrl
      });

      let folername = await verify_foldername();
      const frontend_url = folername.basename;
      const backend_url = folername.basename + "/contao";

      const allPages = await browser.pages();


      for (const currentPage of allPages) {
        const currentPageUrl = currentPage.url();
        //console.log('currentPageUrl:', currentPageUrl)
        if (currentPageUrl.includes(frontend_url) && currentPageUrl.includes(backend_url) == false) {

          await currentPage.reload({
            ignoreCache: true
          });

          console.log(
            " puppeteer_reload ".bgWhite.black +
            " reload ".black.dim
          );
        }
      }
      await browser.disconnect();

      return true

    } catch (err) {
      //console.error('Error:', err);
      console.log(
        " puppeteer_reload ".bgWhite.black +
        " starting chrome in debug mode ".yellow
      );
      await module.exports.start_chrome_in_debug_mode()
      return false
    }
  },
  /* 
   * Restart chrome in debug mode
   * google-chrome --remote-debugging-port=9222
   * Required for connecting puppeteer
   */
  start_chrome_in_debug_mode: async function () {

    console.log(
      " puppeteer_chrome ".bgWhite.black +
      " starting chrome in debug mode".yellow.dim
    );

    try {
      const {
        stdout,
        stderr
      } = await exec(`pkill -9 chrome`);
    } catch (error) {
      console.log("chrome  was not open possibly")
    }




    const {
      spawn
    } = require('child_process');

/* 
    const chrome = spawn('google-chrome', ['--remote-debugging-port=9222', '--restore-last-session'], {
      detached: true,
      stdio: 'ignore'
    }); */
    const chrome = spawn('google-chrome', ['--remote-debugging-port=9222'], {
      detached: true,
      stdio: 'ignore'
    });

    chrome.unref(); // This ensures the parent can exit independently of the child.

    // Function to introduce a delay
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // Wait for 2 seconds
    await delay(2000);

    await module.exports.puppeteer_reload()
    return true

  },
}