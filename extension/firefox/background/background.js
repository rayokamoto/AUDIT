var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// This background script uses onBeforeSendHeaders to grab the auth token from the targetURL and use that to get the timetable data for the entire semester 
// For Firefox only
var targetURL = "https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_WIDGET/queryx/*";
function getIDandCode(url, token) {
    return __awaiter(this, void 0, void 0, function () {
        var queryMatch, ID, semCode, res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queryMatch = url.match(/\/(\d+)\&/);
                    ID = queryMatch ? queryMatch[1] : null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, window.fetch(url, {
                            headers: {
                                "access-control-allow-credentials": "true",
                                "access-control-allow-headers": "accept,authorization,access-control-allow-headers,access-control-allow-origin",
                                "access-control-allow-methods": "GET,OPTIONS",
                                "Authorization": token
                            }
                        })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.json().then(function (resData) {
                            semCode = resData.data.query.rows[0]["A.STRM"];
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, { ID: ID, semCode: semCode }];
            }
        });
    });
}
function getTimetable(e) {
    return __awaiter(this, void 0, void 0, function () {
        var token, timetableData, ID, semCode, res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Removes the onBeforeSendHeaders listener so it doesnt get fired when addtional requests are made to urls which have patterns matching the target url
                    browser.webRequest.onBeforeSendHeaders.removeListener(getTimetable);
                    token = e.requestHeaders.find(function (data) { return data.name === "Authorization"; }).value;
                    return [4 /*yield*/, getIDandCode(e.url, token).then(function (data) {
                            ID = data.ID;
                            semCode = data.semCode;
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, window.fetch("https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_LIST/queryx/".concat(ID, ",").concat(semCode, "&MaxRows=9999"), {
                            headers: {
                                "access-control-allow-credentials": "true",
                                "access-control-allow-headers": "accept,authorization,access-control-allow-headers,access-control-allow-origin",
                                "access-control-allow-methods": "GET",
                                "Authorization": token
                            }
                        })];
                case 3:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 4:
                    timetableData = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [2 /*return*/, err_1];
                case 6:
                    console.log(timetableData);
                    browser.storage.local.set(timetableData);
                    return [2 /*return*/, timetableData];
            }
        });
    });
}
// Registers the onBeforeSendHeaders event listener everytime the myadelaide page loads 
browser.webNavigation.onCompleted.addListener((function (e) {
    browser.webRequest.onBeforeSendHeaders.addListener(getTimetable, { urls: [targetURL] }, ["requestHeaders"]);
}));
