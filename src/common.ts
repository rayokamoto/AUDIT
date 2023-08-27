/**
 * Common functions
 */

// TODO: merge common variables, functions, etc. from Chrome and Firefox scripts

import { appendLog, logLevels } from "./log";

export const downloadFileName = "uni-timetable.ics";

export const instructions = document.getElementById("instructions")!;
export const status = document.getElementById("status")!;

export const progressBox = document.getElementById("progress-box")!;
export const errorBox = document.getElementById("error-box")!;

export const downloadBox = document.getElementById("download-box")!;
export const button = document.getElementById("get-ical")!;

export const downloadLogsBtn = document.getElementById("download-logs")!;

export function toggleInitVis() {
  instructions.style.display = "none";
  downloadBox.style.display = "none";
  status.style.display = "block";
}

export function injectVersion(version: string) {
  const verText = document.getElementById("ver-text")!;
  verText.innerHTML = version;
}

export function checkPermissions() {
  if (typeof browser !== "undefined") {
    // Firefox
    browser.permissions.contains({
      origins: ["*://myadelaide.uni.adelaide.edu.au/*"]
    }).then((result) => {
      if (!result) {
        appendLog(logLevels.ERROR, "Permission not granted! Please grant necessary permissions for the extension.");
        toggleInitVis();
        addError("Please grant the necessary permissions to use this extension");
      }
    });
  } else if (chrome) {
    // Chrome
    chrome.permissions.contains({
      origins: ["*://myadelaide.uni..adelaide.edu.au/*"]
    }, (result:any) => {
      if (!result) {
        appendLog(logLevels.ERROR, "Permission not granted! Please grant necessary permissions for the extension.");
        toggleInitVis();
        addError("Please grant the necessary permissions to use this extension");
      }
    });
  } else {
    appendLog(logLevels.ERROR, "Unsupported browser. Please use Firefox or Chrome.");
  }
}

export function addError(text: string) {
  errorBox.innerHTML += `<div class="error">Error: ${text}</div>`;
}


export function addProgress(text: string) {
  progressBox.innerHTML += `<div class="progress-item">${text}</div>`;
}

export function checkForNewVersion(currentVersion: string) {
  fetch("https://api.github.com/repos/rayokamoto/AUDIT/releases/latest").then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      appendLog(logLevels.ERROR, "Failed to fetch latest release");
      throw new Error("Failed to fetch latest release");
    }
  }).then((data) => {
    const latestVersion = data.tag_name.replace("v", "");
    const updateBox = document.getElementById("update")!;
      if (latestVersion > currentVersion) {
        appendLog(logLevels.INFO, `New version available: ${latestVersion}`);
        updateBox.style.display = "block";
        updateBox.innerHTML += `<a href = "https://github.com/repos/rayokamoto/AUDIT/releases/latest">New version available: ${latestVersion}. (Right click and open in a new tab)</a>`
      }
  }).catch((err) => {
    appendLog(logLevels.ERROR, `Failed to check for new release: ${err}`);
  });
}