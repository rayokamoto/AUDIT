/**
 * This background script uses onBeforeSendHeaders to grab the auth token from the targetURL and use that to get the timetable data for the entire semester
 * 
 * For Firefox only
 */


const targetURL = "https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_WIDGET/queryx/*";

async function getIDandCode(url: string, token: string) {
  let queryMatch = url.match(/\/(\d+)\&/);
  let ID = queryMatch ? queryMatch[1] : null;
  let semCode;
  try {
    const res = await window.fetch(url, {
      headers: {
        "access-control-allow-credentials": "true",
        "access-control-allow-headers": "accept,authorization,access-control-allow-headers,access-control-allow-origin",
        "access-control-allow-methods": "GET,OPTIONS",
        "Authorization": token
      }
    });
    await res.json().then(resData => {
      semCode = resData.data.query.rows[0]["A.STRM"];
    })
  } catch (err) {
    console.error(err)
  }
  return { ID, semCode };
}

async function getTimetable(e: any) {
  // Removes the onBeforeSendHeaders listener so it doesnt get fired when addtional requests are made to urls which have patterns matching the target url
  browser.webRequest.onBeforeSendHeaders.removeListener(getTimetable);
  let token = e.requestHeaders.find((data: any) => data.name === "Authorization").value;
  let timetableData;
  let ID, semCode;
  await getIDandCode(e.url, token).then(data => {
    ID = data.ID;
    semCode = data.semCode;
  });
  try {
    const res = await window.fetch(`https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_LIST/queryx/${ID},${semCode}&MaxRows=9999`, {
      headers: {
        "access-control-allow-credentials": "true",
        "access-control-allow-headers": "accept,authorization,access-control-allow-headers,access-control-allow-origin",
        "access-control-allow-methods": "GET",
        "Authorization": token
      }
    });
    timetableData = await res.json();
  } catch (err) {
    console.error(err);
    return err;
  }
  browser.storage.local.set(timetableData).catch(err => {
    console.error(err);
  }).then(() => {
    console.log("Timetable data saved to local storage");
  });
  return timetableData;
}

// Registers the onBeforeSendHeaders event listener everytime the myadelaide page loads 
browser.webNavigation.onCompleted.addListener(
  ((e) => {
    browser.webRequest.onBeforeSendHeaders.addListener(
      getTimetable,
      { urls: [targetURL] },
      ["requestHeaders"]
    );
  })
)
