/**
 * Global logging
 */

let logs: string[] = [];

export enum logLevels {
  DEBUG,
  INFO,
  WARN,
  ERROR,
};

export function appendLog(level: logLevels, text: string) {
  const t = new Date().toISOString();
  switch (level) {
    case logLevels.DEBUG:
      logs.push(`${t} [DEBUG] ${text}\n`);
      addLogsToElement(text, t, "DEBUG");
      break;
    case logLevels.INFO:
      logs.push(`${t} [INFO] ${text}\n`);
      addLogsToElement(text, t, "INFO");
      break;
    case logLevels.WARN:
      logs.push(`${t} [WARN] ${text}\n`);
      addLogsToElement(text, t, "WARN");
      break;
    case logLevels.ERROR:
      logs.push(`${t} [ERROR] ${text}\n`);
      addLogsToElement(text, t, "ERROR");
      break;
    default:
      logs.push(`${t} ${text}\n`);
      addLogsToElement(text, t, "");
      break;
  }
}

export function getLogs() {
  return logs;
}

function addLogsToElement(logMessage: string, logTimestamp: string, logLevel: string) {
  const element = document.getElementById("logs-panel");
  const log = document.createElement("div");
  const logMessageElement = document.createElement("span");
  const logTimestampElement = document.createElement("span");
  const logLevelElement = document.createElement("span");
  
  log.setAttribute("id", "log");
  logMessageElement.setAttribute("id", "log-message");
  logTimestampElement.setAttribute("id", "log-timestamp");
  logLevelElement.setAttribute("id", "log-level-${logLevel}");

  logTimestampElement.innerText = logTimestamp;
  logMessageElement.innerText =logMessage;
  logLevelElement.innerText =  ` [${logLevel}] `;;

  log.appendChild(logTimestampElement);
  log.appendChild(logLevelElement);
  log.appendChild(logMessageElement);

  if (element) {
    element.appendChild(log);
  }
}

export function getLogsAsFile() {
  return new Blob(logs, { type: "text/plain" });
}
