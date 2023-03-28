# AUDIT: Adelaide University Downloadable iCal Timetable
This utility allows you to generate an iCal file containing your University of Adelaide timetable for a given semester, which you can then import into your calendar.

## Installation

You can install AUDIT by downloading it through the releases tab or by building it yourself (see [Developing](#developing) for more information).

AUDIT is not currently available on Firefox Add-ons or the Chrome Web Store.

### Chrome
Download the zip file from the releases tab or build the extension yourself.

Unzip the Chrome file and load the unpacked extension at `chrome://extensions`. Make sure that developer mode is enabled, otherwise the option to load an unpacked extension won't be available.

### Firefox

Download the `.xpi` file from the releases tab or build it yourself.

Go to `about:addons` then under the settings icon, click "Install Add-on From File...". Make sure to give the extension its required permissions.

## Importing iCal file

The generated iCal file can be imported into your calendar to automatically add your university timetable.

### Importing iCal file to Google Calendar

To import the iCal file into Google Calendar, follow these steps:

1. Download the iCal file from the AUDIT extension.
2. Open your Google Calendar.
3. Click the "Settings" gear icon in the top right corner.
4. Select "Settings" from the dropdown menu.
5. Click on the "Import & Export" tab on the left-hand side of the screen.
6. Click on the "Select file from your computer" button and choose the downloaded iCal file.
7. Choose the calendar where you want to add the imported events.
8. Click "Import" and wait for the calendar to import the events from the iCal file.

### Importing iCal file to Apple Calendar

To import the iCal file into Apple Calendar, follow these steps:

1. Download the iCal file from the AUDIT.
2. Open Apple Calendar.
3. Click on "File" in the top left corner of the screen.
4. Select "Import" from the dropdown menu.
5. Choose the downloaded iCal file from your computer.
6. Choose the calendar where you want to add the imported events.
7. Click "Import" and wait for the calendar to import the events from the iCal file.

> **Note**
> Depending on the version of the Google Calendar or Apple Calendar you are using, the steps may differ slightly, but the general process should be the same.

## Developing 
- Run `npm install` to install dependencies
- Run `python3 build.py prod` (`py build.py prod` on Windows) to convert TypeScript to JavaScript and copy the necessary files
- Find the extension under `extension/`
