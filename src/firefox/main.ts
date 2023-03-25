import { downloadFileName, button, toggleInitVis, addError, addProgress, checkPermissions} from "../common";
import { createCalendar, generateICal } from "../parser/parser";

console.info("Firefox main.js initialized");
checkPermissions();
button.onclick = getData;

async function getData() {
  toggleInitVis();

  let rawData = {};
  await browser.storage.local.get().then(data => rawData = data);
  if (!Object.keys(rawData).length) {
    let err = "Failed to fetch data from API";
    console.error(err);
    addError(err)
  }

  const calendar = createCalendar("University", rawData);
  const iCal = generateICal(calendar);
  const downloadLink = document.createElement("a");
  downloadLink.href = iCal;
  downloadLink.download = downloadFileName;
  downloadLink.click();
  addProgress("Downloaded iCal file");
}

