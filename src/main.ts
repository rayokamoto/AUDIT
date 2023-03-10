
const targetURL = "https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_WEEKLY/queryx/*";
let semCode = 4310; // for testing only
let studentID = 1886739; // for testing only
let counter = 0;

function getTimetable(e: any) {
  counter++;
  let rawData = e.requestHeaders;
  let token = "";
  for (const data of rawData) {
    if (data.name === "Authorization") {
      token = data.value;
    }
  }

  let timetable = window.fetch(`https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_LIST/queryx/${studentID},${semCode}&MaxRows=9999`, {
    headers: {
      "access-control-allow-credentials": "true",
      "access-control-allow-headers": "accept,authorization,access-control-allow-headers,access-control-allow-origin",
      "access-control-allow-methods": "GET,OPTIONS",
      "Authorization": token
    }
  })
  
  let timetableData;

  timetable
  	.then((res) => res.json())
  	.then((data) => {timetableData = data})
	.catch((err) => console.error(err))

  if (counter === 1) {
    browser.webRequest.onBeforeSendHeaders.removeListener(getTimetable);
  }
  return { requestHeaders: e.requestHeaders, timetableData };
}

browser.webRequest.onBeforeSendHeaders.addListener(
  getTimetable,
  { urls: [targetURL] },
  ["blocking", "requestHeaders"]
);
