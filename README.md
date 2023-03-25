# Adelaide Uni Downloadable iCal Timetable (AUDIT)
This project allows you to generate an iCal file containing your university timetable for a given semester, which you can then import into your calendar. 

## Installation

You can install AUDIT from the following web stores:

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/[]?label=Chrome%20Web%20Store&logo=google-chrome&logoColor=white)]()

[![Firefox Add-ons](https://img.shields.io/amo/v/[]?label=Firefox%20Add-ons&logo=firefox-browser&logoColor=white)]()

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

> **Note:** Depending on the version of the Google Calendar or Apple Calendar you are using, the steps may differ slightly, but the general process should be the same.

## Developing 
- Run `npm install` to install dependencies
- Run `build.py` to convert TypeScript to JavaScript and copy necessary files
- Find the extension under `extension/`