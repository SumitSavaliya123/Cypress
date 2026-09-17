const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",

    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    fixturesFolder: "cypress/fixtures",

    defaultCommandTimeout: 15000,
    pageLoadTimeout: 120000,
    requestTimeout: 15000,
    responseTimeout: 15000,

    retries: {
      runMode: 1,
      openMode: 0,
    },

    viewportWidth: 1280,
    viewportHeight: 720,

    video: true,
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    reporter: "spec",

    env: {
      allure: true,
    },

    setupNodeEvents(on, config) {
      allureWriter(on, config);

      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium") {
          launchOptions.args.push("--disable-gpu");
          launchOptions.args.push("--no-sandbox");
          launchOptions.args.push("--disable-dev-shm-usage");
        }
        return launchOptions;
      });

      on("task", {
        logError({ username, message, stack }) {
          const logDir = path.join(process.cwd(), "logs");
          if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
          }

          function stripAnsi(str = "") {
            return str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "");
          }

          const currentDate = new Date()
            .toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })
            .split("/")
            .reverse()
            .map((n) => n.padStart(2, "0"))
            .join("-");

          const logFile = path.join(logDir, `error-log-${currentDate}.txt`);
          const timestamp = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });

          const cleanMessage = stripAnsi(message || "No message provided");
          const cleanStack = stripAnsi(stack || "No stack trace available");

          const logEntry = `\n[${timestamp}]\nUser: ${username}\nError: ${cleanMessage}\nStack: ${cleanStack}\n\n-------------------------------------------------------\n`;

          fs.appendFileSync(logFile, logEntry, "utf8");
          console.log(
            `Error logged for ${username} in ${path.basename(logFile)}`,
          );
          return null;
        },
      });

      return config;
    },
  },
});
