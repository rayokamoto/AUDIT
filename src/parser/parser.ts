// Parse JSON data and convert it to .ics format

import ical, { ICalCalendar, ICalEventRepeatingFreq, ICalRepeatingOptions } from "ical-generator";

import { addError, addProgress } from "../common";
import * as utils from "./utils";

// NOTE:
// LECTURE_SORT categories
// 1: Lecture
// 2: Workshop | Practical

/**
 * Create a single calendar event
 * @param calendar
 * @param data JSON data from API response
 */
function createCalEvent(calendar: ICalCalendar, data: { [x: string]: any; }) {
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
  //let startDate = new Date(Date.parse(startDateData));
  let endDate = new Date(Date.parse(endDateData));
  console.debug(`${eventSummary} - start: ${eventStart},end: ${eventEnd},enddate: ${endDate},clsType: ${classType}`);
  //let dateDelta = endDate.getTime() - startDate.getTime();
  const repeatOptions: ICalRepeatingOptions = {
    freq: ICalEventRepeatingFreq.WEEKLY,
    until: endDate,
  }

  calendar.createEvent({
    summary: eventSummary,
    location: eventLocation,
    description: classType,
    start: eventStart,
    end: eventEnd,
    repeating: repeatOptions,
  });
}

export function createCalendar(name: string, data: { [x: string]: any; }): ICalCalendar {
  let calendar = ical({ name: name });
  if (data["status"] !== "success") {
    let err = "API response was not successful!";
    console.error(err);
    addError(err);
    // TODO: return this as error or raise exception
  }

  if (data["data"]["query"]["queryname="] !== "TIMETABLE_LIST") {
    let err = "Data is not timetable list, cannot proceed further";
    console.error(err);
    addError(err);
    // TODO: return as error or raise exception
  }

  const numRows: number = data["data"]["query"]["numrows"];
  const rows: { [x: string]: any; } = data["data"]["query"]["rows"];
  for (let i = 0; i < numRows; ++i) {
    createCalEvent(calendar, rows[i]);
  }

  console.debug(calendar.events());

  addProgress("Parsed JSON into iCal");
  return calendar
}

export function generateICal(cal: ICalCalendar): string {
  const blobData = cal.toBlob();
  const blobURL = URL.createObjectURL(blobData);
  addProgress("Generated iCal file");
  return blobURL;
}
