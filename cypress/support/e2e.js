// This file is loaded automatically before every test file.

import "@cypress/xpath";
import "@shelex/cypress-allure-plugin";
import "./commands";

// ── Global: Uncaught Application Exceptions ──────────────────────────────────
// OrangeHRM throws JS errors unrelated to our tests. We suppress them so
// they don't fail the test, but we DO log them for traceability.
Cypress.on("uncaught:exception", (err, runnable) => {
  const testTitle = runnable?.title || "Unknown Test";
  const message = err?.message || String(err);
  const stack = err?.stack || "No stack trace";

  // Log to Cypress console
  Cypress.log({
    name: "uncaught:exception",
    message: `[${testTitle}] ${message}`,
    consoleProps: () => ({ error: err, test: testTitle }),
  });

  // Write to log file via task (fire-and-forget, non-blocking)
  cy.task("logError", {
    username: "App (uncaught:exception)",
    message: `[${testTitle}] ${message}`,
    stack,
  });

  // Return false to prevent test failure for app-level JS errors
  return false;
});

// ── Global: Test Failure Hook ─────────────────────────────────────────────────
// Fires whenever any Cypress assertion or command fails.
// Logs the failure details to the error log file for traceability.
Cypress.on("fail", (err, runnable) => {
  const testTitle = runnable?.title || "Unknown Test";
  const suiteName = runnable?.parent?.title || "Unknown Suite";
  const message = err?.message || String(err);
  const stack = err?.stack || "No stack trace";

  // Write to log file — use window.Cypress.task directly since cy.* may be
  // unavailable mid-command queue during a fail event
  cy.task("logError", {
    username: `[FAIL] ${suiteName} > ${testTitle}`,
    message,
    stack,
  });

  // Re-throw so Cypress still marks the test as failed
  throw err;
});

