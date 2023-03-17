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
const targetURL = "https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_WIDGET/queryx/*";
function getIDandCode(url, token) {
    return __awaiter(this, void 0, void 0, function* () {
        let queryMatch = url.match(/\/(\d+)\&/);
        let ID = queryMatch ? queryMatch[1] : null;
        let semCode;
        try {
            const res = yield window.fetch(url, {
                headers: {
                    "access-control-allow-credentials": "true",
                    "access-control-allow-headers": "accept,authorization,access-control-allow-headers,access-control-allow-origin",
                    "access-control-allow-methods": "GET,OPTIONS",
                    "Authorization": token
                }
            });
            yield res.json().then(resData => {
                semCode = resData.data.query.rows[0]["A.STRM"];
            });
        }
        catch (error) {
            console.error(error);
        }
        return { ID, semCode };
    });
}
function getTimetable(e) {
    return __awaiter(this, void 0, void 0, function* () {
        browser.webRequest.onBeforeSendHeaders.removeListener(getTimetable);
        let token = e.requestHeaders.find((data) => data.name === "Authorization").value;
        let timetableData;
        let ID, semCode;
        yield getIDandCode(e.url, token).then(data => {
            ID = data.ID;
            semCode = data.semCode;
        });
        try {
            const res = yield window.fetch(`https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_LIST/queryx/${ID},${semCode}&MaxRows=9999`, {
                headers: {
                    "access-control-allow-credentials": "true",
                    "access-control-allow-headers": "accept,authorization,access-control-allow-headers,access-control-allow-origin",
                    "access-control-allow-methods": "GET",
                    "Authorization": token
                }
            });
            timetableData = yield res.json();
        }
        catch (err) {
            console.error(err);
            return err;
        }
        browser.storage.local.set(timetableData);
        return timetableData;
    });
}
browser.webNavigation.onCompleted.addListener(((e) => {
    browser.webRequest.onBeforeSendHeaders.addListener(getTimetable, { urls: [targetURL] }, ["requestHeaders"]);
}));
