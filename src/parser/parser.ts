/**
 * Parse JSON data and convert it to .ics format
 */

import ical, {
  ICalCalendar,
  ICalEventRepeatingFreq,
  ICalRepeatingOptions,
} from "ical-generator";

import { addError, addProgress } from "../common";
import { appendLog, logLevels } from "../log";
import * as utils from "./utils";

/**
 * Create a single calendar event
 * @param calendar
 * @param data JSON data from API response
 */
function createCalEvent(calendar: ICalCalendar, data: { [x: string]: any }) {
  const B_SUBJECT = data["B.SUBJECT"];
  const B_CATALOG_NBR = data["B.CATALOG_NBR"];
  const B_DESCR = data["B.DESCR"];
  const eventSummary = `${B_SUBJECT} ${B_CATALOG_NBR} - ${B_DESCR}`;

  const G_DESCR = data["G.DESCR"];
  const F_ROOM = data["F.ROOM"];
  const F_DESCR = data["F.DESCR"];
  const eventLocation: string = `${G_DESCR} / ${F_ROOM} / ${F_DESCR}`;

  const D_XLATSHORTNAME = data["D.XLATSHORTNAME"];
  const classType: string = D_XLATSHORTNAME;

  const startDateData = data["E.START_DT"];
  const endDateData = data["E.END_DT"];
  const startTimeData = data["START_TIME"];
  const endTimeData = data["END_TIME"];

  const startTime = utils.convertTime12to24(startTimeData);
  const endTime = utils.convertTime12to24(endTimeData);

  const eventStart = new Date(Date.parse(`${startDateData}T${startTime}`));
  const eventEnd = new Date(Date.parse(`${startDateData}T${endTime}`));

  // Use this to calculate repeating times
  // The UNTIL parameter is non-inclusive, so set untilTime to midnight after the endDate to include the last event occurrence
  let utilTime = new Date(new Date(endDateData).setHours(24, 0, 0, 0)); 
  appendLog(logLevels.DEBUG,`Creating event: ${eventSummary} - start: ${eventStart}; end: ${eventEnd}; untiltime: ${utilTime}; clsType: ${classType}`);
  const repeatOptions: ICalRepeatingOptions = {
    freq: ICalEventRepeatingFreq.WEEKLY,
    until: utilTime,
  };

  calendar.createEvent({
    summary: eventSummary,
    location: eventLocation,
    description: classType,
    start: eventStart,
    end: eventEnd,
    repeating: repeatOptions,
  });

  appendLog(logLevels.DEBUG,`Created event: ${eventSummary} - start: ${eventStart}; end: ${eventEnd}; untiltime: ${utilTime}; clsType: ${classType}`)
}

export function createCalendar(
  name: string,
  data: { [x: string]: any }
): ICalCalendar {
  let calendar = ical({ name: name });
  const tz = "Australia/Adelaide";
  calendar.timezone(tz);
  calendar.x([
    {
      key: "X-LIC-LOCATION",
      value: tz,
    },
  ]);

  if (data["status"] !== "success") {
    let err = "API response was not successful!";
    appendLog(logLevels.ERROR, err);
    addError(err);
    throw new Error(err);
  }

  if (data["data"]["query"]["queryname="] !== "TIMETABLE_LIST") {
    let err = "Data is not timetable list, cannot proceed further";
    appendLog(logLevels.ERROR, err);
    addError(err);
    throw new Error(err);
  }

  const numRows: number = data["data"]["query"]["numrows"];
  const rows: { [x: string]: any } = data["data"]["query"]["rows"];
  for (let i = 0; i < numRows; ++i) {
    // NOTE: Crude way to skip events with no start time
    // TODO: Find more elegant solution
    if (rows[i]["START_TIME"] === "") {
      appendLog(logLevels.WARN, `Skipping event with no start time: ${rows[i]["B.SUBJECT"]} ${rows[i]["B.CATALOG_NBR"]} - ${rows[i]["B.DESCR"]}`);
      continue;
    }
    createCalEvent(calendar, rows[i]);
  }
  appendLog(logLevels.INFO, "Parsed JSON into iCal");
  addProgress("Parsed JSON into iCal");
  return calendar;
}

export function generateICal(cal: ICalCalendar): string {
  let blobURL = "";
  try {
    const blobData = cal.toBlob();
    blobURL = URL.createObjectURL(blobData);
    appendLog(logLevels.INFO, `Generated iCal file with file name: ${blobURL}`);
    addProgress("Generated iCal file");
  } catch (e) {
    appendLog(logLevels.ERROR, `Failed to generate iCal file: ${e}`);
    addError("Failed to generate iCal file");
  }
  return blobURL;
}
