// TODO: merge common variables, functions, etc. from Chrome and Firefox scripts

export const downloadFileName = "uni-timetable.ical";

export const instructions = document.getElementById("instructions")!;
export const status = document.getElementById("status")!;

export const progressBox = document.getElementById("progress-box")!;
export const errorBox = document.getElementById("error-box")!;

export const downloadBox = document.getElementById("download-box")!;
export const button = document.getElementById("get-ical")!;

export function toggleInitVis() {
  instructions.style.display = "none";
  downloadBox.style.display = "none";
  status.style.display = "block";
}

export function checkPermissions() {
  if (!browser) {
    // Firefox
    browser.permissions.contains({
      origins: ["*://*.adelaide.edu.au/*"]
    }).then((result) => {
      if (!result) {
        console.error("Permission not granted");
        toggleInitVis();
        addError("Please grant the necessary permissions to use this extension");
      }
    });
  } else if (chrome) {
    // Chrome
    chrome.permissions.contains({
      origins: ["*://*.adelaide.edu.au/*"]
    }, (result:any) => {
      if (!result) {
        console.error("Permission not granted");
        toggleInitVis();
        addError("Please grant the necessary permissions to use this extension");
      }
    });
  } else {
    console.error("Unsupported browser");
  };
}

export function addError(text: string) {
  errorBox.innerHTML += `<div class="error">Error: ${text}</div>`;
}

export function addProgress(text: string) {
  progressBox.innerHTML += `<div class="progress-item">${text}</div>`;
}