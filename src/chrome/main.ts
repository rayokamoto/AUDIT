import {
  downloadFileName,
  button,
  downloadLogsBtn,
  toggleInitVis,
  addProgress,
  checkPermissions,
  injectVersion,
  checkForNewVersion,
} from "../common";
import { createCalendar, generateICal } from "../parser/parser";
import { appendLog, getLogsAsFile, logLevels } from "../log";

appendLog(logLevels.INFO, "Chrome main.js initialised");

const currentVersion = chrome.runtime.getManifest().version;
injectVersion(currentVersion);

checkPermissions();
checkForNewVersion(currentVersion);

if (button) {
  button.addEventListener("click", getData);
}

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
  appendLog(logLevels.INFO, "Fetching data from API");
  try {
    const [tab] = await chrome.tabs.query({
      currentWindow: true,
      active: true,
    });
    const tabID = tab.id;

    const results = await chrome.scripting.executeScript({
      target: { tabId: tabID! },
      func: function () {
        return window.sessionStorage.getItem("myAdel");
      },
    });
    appendLog(logLevels.INFO, "Fetched access token of user");

    const { accessToken } = JSON.parse(results[0].result!);
    const token = accessToken.accessToken;
    const rawId = accessToken.claims.sub;
    const id = rawId.substring(1);

    const semCode = await getSemCode(id, token);
    const rawData = await getTimetable(id, token, semCode);
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
  } catch (error: string | any) {
    appendLog(logLevels.ERROR, error);
  }
}

async function getSemCode(id: any, token: any) {
  try {
    appendLog(logLevels.INFO, "Fetching semester code");
    const res = await fetch(
      `https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_WIDGET/queryx/${id}&MaxRows=5`,
      {
        headers: {
          "access-control-allow-credentials": "true",
          "access-control-allow-headers":
            "accept,authorization,access-control-allow-headers,access-control-allow-origin",
          "access-control-allow-methods": "GET,OPTIONS",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      appendLog(logLevels.ERROR, "Failed to fetch semester code, got: ${res.status} as response");
      throw new Error("Failed to fetch semester code");
    }
    appendLog(logLevels.INFO, "Fetched semester code");
    const resData = await res.json();
    appendLog(logLevels.INFO, "Parsed semester code");
    return resData.data.query.rows[0]["A.STRM"];
  } catch (error: string | any) {
    appendLog(logLevels.ERROR, error);
  }
}

async function getTimetable(id: any, token: any, semCode: any) {
  try {
    appendLog(logLevels.INFO, "Fetching timetable data");
    const res = await fetch(
      `https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_LIST/queryx/${id},${semCode}&MaxRows=9999`,
      {
        headers: {
          "access-control-allow-credentials": "true",
          "access-control-allow-headers":
            "accept,authorization,access-control-allow-headers,access-control-allow-origin",
          "access-control-allow-methods": "GET",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!res.ok) {
      appendLog(logLevels.ERROR, "Failed to fetch timetable data, got: ${res.status} as response");
      throw new Error("Failed to fetch timetable data");
    }
    appendLog(logLevels.INFO, "Fetched timetable data");
    const resData = await res.json();
    appendLog(logLevels.INFO, "Parsed timetable data");
    return resData;
  } catch (error: string | any) {
    appendLog(logLevels.ERROR, error);
  }
}