"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const targetURL = "https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_WEEKLY/queryx/*";
let semCode = 4310; // for testing only
let studentID = 1886739; // for testing only
function getIDandCode(e) {
    let rawData = e;
    // todo
    console.log(rawData);
}
function getTimetable(e) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = e.requestHeaders.find((data) => data.name === "Authorization").value;
        let timetableData;
        try {
            const res = yield window.fetch(`https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_LIST/queryx/${studentID},${semCode}&MaxRows=9999`, {
                headers: {
                    "access-control-allow-credentials": "true",
                    "access-control-allow-headers": "accept,authorization,access-control-allow-headers,access-control-allow-origin",
                    "access-control-allow-methods": "GET,OPTIONS",
                    "Authorization": token
                }
            });
            timetableData = yield res.json();
        }
        catch (err) {
            console.error(err);
        }
        console.log(timetableData);
        browser.webRequest.onBeforeSendHeaders.removeListener(getTimetable);
        return timetableData;
    });
}
browser.webRequest.onBeforeSendHeaders.addListener(getTimetable, { urls: [targetURL] }, ["blocking", "requestHeaders"]);
