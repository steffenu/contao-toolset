require("@babel/register");
import fs from 'fs';
import lighthouse from 'lighthouse';
const chromeLauncher = require("chrome-launcher");


module.exports = {
  lighthouse: async function () { 

    
    const chrome = await chromeLauncher.launch({  chromePath: "/usr/bin/google-chrome", chromeFlags: ['--headless']});
    const options = {logLevel: 'info', output: 'html', onlyCategories: ['performance'], port: chrome.port};
    const runnerResult = await lighthouse('https://landhaus-gardels.de', options);
    
    // `.report` is the HTML report as a string
    const reportHtml = runnerResult.report;
    fs.writeFileSync('lhreport.html', reportHtml);
    
    // `.lhr` is the Lighthouse Result as a JS object
    console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);
    console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
    
    await chrome.kill();
  },
  
};
