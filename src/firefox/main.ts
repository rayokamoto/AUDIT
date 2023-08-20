import { downloadFileName, button, toggleInitVis, addError, addProgress, checkPermissions, downloadLogsBtn, injectVersion, checkForNewVersion } from "../common";
import { logLevels, appendLog, getLogsAsFile } from "../log";
import { createCalendar, generateICal } from "../parser/parser";

appendLog(logLevels.INFO, "Firefox main.js initialised");

const currentVersion = browser.runtime.getManifest().version;
injectVersion(currentVersion);

checkPermissions();
checkForNewVersion(currentVersion);
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

