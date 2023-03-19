// Parse JSON data and convert it to .ics format

import ical, { ICalCalendar, ICalEventRepeatingFreq, ICalRepeatingOptions } from "ical-generator";

import * as utils from "./utils";

// TODO: Add check to validate that status is success, queryname is TIMETABLE_LIST

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

  const D_XLATSHORTNAME = data["D.D_XLATSHORTNAME"];
  const classType: string = D_XLATSHORTNAME;

  const startDateData = data["E.START_DT"];
  const endDateData = data["E.END_DT"];
  const startTimeData = data["START_TIME"];
  const endTimeData = data["END_TIME"];

  const startTime = utils.convertTime12to24(startTimeData);
  const endTime = utils.convertTime12to24(endTimeData);

  const eventStart = new Date(Date.parse(`${startDateData}T${startTime}`));
  const eventEnd = new Date(Date.parse(`${startDateData}T${endTime}`));


  // use this to calculate repeating times
  let startDate = new Date(Date.parse(startDateData));
  let endDate = new Date(Date.parse(endDateData));
  let dateDelta = endDate.getTime() - startDate.getTime();
  console.log(B_SUBJECT,eventStart,startDateData,startTime);
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
  console.log(data);
  if (data["status"] !== "success") {
    console.error("API response was not successful!");
    // TODO: return this as error or raise exception
  }

  if (data["data"]["query"]["queryname="] !== "TIMETABLE_LIST") {
    console.error("Data is not timetable list, cannot proceed further");
    // TODO: return as error or raise exception
  }

  const numRows: number = data["data"]["query"]["numrows"];
  const rows: { [x: string]: any; } = data["data"]["query"]["rows"];
  for (let i = 0; i < numRows; ++i) {
    createCalEvent(calendar, rows[i]);
  }

  return calendar
}


// TODO: there needs to be a function to deal with the file to download, etc.
export function generateICal(cal: ICalCalendar): string {
  const blobData = cal.toBlob();
  const blobURL = URL.createObjectURL(blobData);
  return blobURL;
}


