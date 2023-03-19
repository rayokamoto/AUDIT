import {createCalendar, generateICal} from "./parser";
console.log("main.js initialized")
const button = document.getElementById("btn")!;
button.onclick = getData;

async function getData() {
	let rawData = {};
	await browser.storage.local.get().then(data => rawData = data);

	console.log(rawData);
	let calander =  createCalendar("test", rawData);
	console.log("calander");
	let ical = generateICal(calander);
	console.log(ical);
	const downloadLink = document.createElement('a');
  downloadLink.href = ical;
  downloadLink.download = "test.ical";
  downloadLink.click();
}
