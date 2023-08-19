/**
 * Convert 12-hour time to 24-hour time.
 * @param time12h Time as a string in 12-hour format: `h:m TT`
 * @returns Time as a string in 24-hour format: `hh:mm:00`
 */
export function convertTime12to24(time12h: string): string {
  let [time, modifier] = time12h.split(" ");
  let [hours, mins] = time.split(":");

  // Normalize strings like "A.M." or "P.M." to "AM" and "PM"
  modifier = modifier.replace(".", "");

  if (hours === "12") {
    hours = "00";
  }
  if (modifier == "PM") {
    hours = (parseInt(hours, 10) + 12).toString();
  } else if (parseInt(hours, 10) < 10) {
    return `0${hours}:${mins}:00`;
  }

  return `${hours}:${mins}:00`;
}
