import { createCalendar, generateICal } from "./parser";
const button = document.getElementById("btn")!;
button.onclick = getData;

async function getData() {
  let rawData = {};
  await browser.storage.local.get().then(data => rawData = data);

  let calander = createCalendar("test", rawData);
  let ical = generateICal(calander);
  const downloadLink = document.createElement('a');
  downloadLink.href = ical;
  downloadLink.download = "test.ical";
  downloadLink.click();
}
