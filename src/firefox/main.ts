import { downloadFileName, button, toggleInitVis, addError, addProgress, checkPermissions, downloadLogsBtn } from "../common";
import { logLevels, appendLog, getLogsAsFile } from "../log";
import { createCalendar, generateICal } from "../parser/parser";

appendLog(logLevels.INFO, "Firefox main.js initialised");
checkPermissions();
checkForNewGithubRelease();
button.onclick = getData;

if (downloadLogsBtn) {
  downloadLogsBtn.addEventListener("click", () => {
    const logFile = getLogsAsFile();
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(logFile);
    downloadLink.download = "uni-timetable-logs.txt";
    downloadLink.click();
  });
}

async function getData() {
  toggleInitVis();

  let rawData = {};
  await browser.storage.local.get().then(data => rawData = data);
  if (!Object.keys(rawData).length) {
    let err = "Failed to fetch data from API";
    appendLog(logLevels.ERROR, err);
    addError(err);
    return;
  }

  try {
    const calendar = createCalendar("University", rawData);
    const iCal = generateICal(calendar);
    if (iCal === "") {
      appendLog(logLevels.ERROR, "iCal blob URL is empty");
      throw new Error("iCal blob URL is empty");
    }
    const downloadLink = document.createElement("a");
    downloadLink.href = iCal;
    downloadLink.download = downloadFileName;
    downloadLink.click();
    appendLog(logLevels.INFO, "Downloaded iCal file");
    addProgress("Downloaded iCal file");
  } catch (e) {
    appendLog(logLevels.ERROR, `Failed to generate calendar: ${e}`);
  }
}

function checkForNewGithubRelease() {
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

      const currentVersion = browser.runtime.getManifest().version;
      if (latestVersion > currentVersion) {
        appendLog(logLevels.INFO, `New version available: ${latestVersion}`);
        updateBox.style.display = "block";
        updateBox.innerHTML += `<a href = "https://github.com/repos/rayokamoto/AUDIT/releases/latest">New version available: ${latestVersion}. (Right click and open in a new tab)</a>`
      }
  }).catch((err) => {
    appendLog(logLevels.ERROR, `Failed to check for new release: ${err}`);
  });
}