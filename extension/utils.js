export function convertTime12to24(time12h) {
    let [time, modifier] = time12h.split(" ");
    let [hours, mins] = time.split(":");
    modifier = modifier.replace(".", "");
    if (hours === "12") {
        hours = "00";
    }
    if (modifier == "PM") {
        hours = (parseInt(hours, 10) + 12).toString();
    }
    return `${hours}:${mins}:00`;
}
