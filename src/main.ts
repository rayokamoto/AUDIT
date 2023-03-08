import "firefox-webext-browser";

const targetURL = "https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_WEEKLY/queryx/*";
var semCode = 4310; // for testing only
var studentID = 1886739; // for testing only
var counter = 0;

function getTimetable(e : any) {
    counter++;
    var rawData = e.requestHeaders;
    var token = "";
    for (const data of rawData){
      if (data.name == "Authorization") {
        token = data.value;
      }
    }
  
    var timetable = window.fetch(`https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_LIST/queryx/${studentID},${semCode}&MaxRows=9999`, {
      headers: {
        "access-control-allow-credentials": "true",
        "access-control-allow-headers": "accept,authorization,access-control-allow-headers,access-control-allow-origin",
        "access-control-allow-methods": "GET,OPTIONS",
        "Authorization": token 
      }
    
    })
    
    console.log(timetable);

    if (counter === 1) {
      browser.webRequest.onBeforeSendHeaders.removeListener(getTimetable);
    }
    return { requestHeaders: e.requestHeaders, timetable };
  }

  browser.webRequest.onBeforeSendHeaders.addListener(
    getTimetable,
    { urls: [targetURL]},
    ["blocking", "requestHeaders"]
  );
  