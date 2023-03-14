import ical, { ICalEventRepeatingFreq } from "ical-generator";
import * as utils from "./utils";
function createCalEvent(calendar, data) {
    const B_SUBJECT = data["B.SUBJECT"];
    const B_CATALOG_NBR = data["B.CATALOG_NBR"];
    const B_DESCR = data["B.DESCR"];
    const eventSummary = `${B_SUBJECT} ${B_CATALOG_NBR} - ${B_DESCR}`;
    const G_DESCR = data["G.DESCR"];
    const F_ROOM = data["F.ROOM"];
    const F_DESCR = data["F.DESCR"];
    const eventLocation = `${G_DESCR} / ${F_ROOM} / ${F_DESCR}`;
    const D_XLATSHORTNAME = data["D.D_XLATSHORTNAME"];
    const classType = D_XLATSHORTNAME;
    const startDateData = data["E.START_DT"];
    const endDateData = data["E.END_DT"];
    const startTimeData = data["START_TIME"];
    const endTimeData = data["END_TIME"];
    const startTime = utils.convertTime12to24(startTimeData);
    const endTime = utils.convertTime12to24(endTimeData);
    const eventStart = new Date(Date.parse(`${startDateData}T${startTime}`));
    const eventEnd = new Date(Date.parse(`${startDateData}T${endTime}`));
    let startDate = new Date(Date.parse(startTimeData));
    let endDate = new Date(Date.parse(endTimeData));
    let dateDelta = endDate.getTime() - startDate.getTime();
    const repeatOptions = {
        freq: ICalEventRepeatingFreq.WEEKLY,
        until: endDate,
    };
    calendar.createEvent({
        "summary": eventSummary,
        "location": eventLocation,
        "description": classType,
        "start": eventStart,
        "end": eventEnd,
        "repeating": repeatOptions,
    });
}
function createCalendar(name) {
    let calendar = ical();
    return calendar.name(name);
}
let testCal = createCalendar("Test Calendar");
console.log(testCal);
