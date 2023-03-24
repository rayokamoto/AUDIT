import { createCalendar, generateICal } from "../parser/parser";
import { downloadFileName } from "../common";

console.info("Firefox main.js initialized");

const button = document.getElementById("get-ical")!;
button.onclick = getData;

async function getData() {
  console.log("get data queried");
  let rawData = {};
  await browser.storage.local.get().then(data => rawData = data);

  const calendar = createCalendar("uni", rawData);
  const iCal = generateICal(calendar);
  const downloadLink = document.createElement('a');
  downloadLink.href = iCal;
  downloadLink.download = downloadFileName;
  downloadLink.click();
}
