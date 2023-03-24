import { createCalendar, generateICal } from "../parser/parser";

console.info("firefox main.js initialized")

const button = document.getElementById("btn")!;
button.onclick = getData;

async function getData() {
  let rawData = {};
  await browser.storage.local.get().then(data => rawData = data);

  let calander = createCalendar("uni", rawData);
  let ical = generateICal(calander);
  const downloadLink = document.createElement('a');
  downloadLink.href = ical;
  downloadLink.download = "uni.ical";
  downloadLink.click();
}
