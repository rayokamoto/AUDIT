
const targetURL = "https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_WEEKLY/queryx/*";
let semCode = 4310; // for testing only
let studentID = 1886739; // for testing only

function getIDandCode(e: any) {
  let rawData = e;
  // todo
  console.log(rawData);
}


async function getTimetable(e: any) {
  let token = e.requestHeaders.find((data: any) => data.name === "Authorization").value;
  let timetableData;

  try {
    const res = await window.fetch(`https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_LIST/queryx/${studentID},${semCode}&MaxRows=9999`, {
      headers: {
        "access-control-allow-credentials": "true",
        "access-control-allow-headers": "accept,authorization,access-control-allow-headers,access-control-allow-origin",
        "access-control-allow-methods": "GET,OPTIONS",
        "Authorization": token
      }
    });

    timetableData = await res.json();
  } catch (err) {
    timetableData = err;
    console.error(err);
  }

  browser.webRequest.onBeforeSendHeaders.removeListener(getTimetable);
  return timetableData;
}

browser.webRequest.onBeforeSendHeaders.addListener(
  getTimetable,
  { urls: [targetURL] },
  ["blocking", "requestHeaders"]
);
