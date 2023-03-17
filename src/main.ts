import {createCalendar} from "./parser";

const button = document.getElementById("btn")!;
button.onclick = getData;

async function getData() {
  let rawData = {};
  await browser.storage.local.get().then(data => rawData = data.data);

  let calander = createCalendar("test", rawData);

  console.log("calander");
}