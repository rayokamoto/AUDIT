import { createCalendar, generateICal } from "../parser/parser";
console.info("chrome main.js initialized")
const button = document.getElementById("btn")!;
button.onclick = getData;

async function getData() {
	chrome.tabs.query({ currentWindow: true, active: true }, (t) => {
		let tabID = t[0].id!;
		chrome.scripting.executeScript({
			target: { tabId: tabID },
			func: function () {
				return window.sessionStorage.getItem("myAdel");
			},
		}, async function (results) {
			var sessionStorageData = JSON.parse(results[0].result!);
			let token: string = sessionStorageData.accessToken.accessToken;
			let rawId: string = sessionStorageData.accessToken.claims.sub;
			let id: string = rawId.substring(1);
			await getSemCode(id, token).then((semCode) => {
				getTimetable(id, token, semCode!).then(rawData => {
					let calander = createCalendar("uni", rawData);
					let ical = generateICal(calander);
					const downloadLink = document.createElement('a');
					downloadLink.href = ical;
					downloadLink.download = "uni.ical";
					downloadLink.click();
				});

			})

		})
	})
}



async function getSemCode(id: string, token: string) {
	let semCode;
	try {
		const res = await fetch(`https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_WIDGET/queryx/${id}&MaxRows=5`, {
			headers: {
				"access-control-allow-credentials": "true",
				"access-control-allow-headers": "accept,authorization,access-control-allow-headers,access-control-allow-origin",
				"access-control-allow-methods": "GET,OPTIONS",
				"Authorization": `Bearer ${token}`
			}
		});
		await res.json().then(resData => {
			semCode = resData.data.query.rows[0]["A.STRM"];
		})
	} catch (error) {
		console.error(error);
	}
	return semCode;
}

async function getTimetable(id: string, token: string, semCode: string) {
	let timetableData;
	try {
		const res = await fetch(`https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_LIST/queryx/${id},${semCode}&MaxRows=9999`, {
			headers: {
				"access-control-allow-credentials": "true",
				"access-control-allow-headers": "accept,authorization,access-control-allow-headers,access-control-allow-origin",
				"access-control-allow-methods": "GET",
				"Authorization": `Bearer ${token}`
			}
		});
		timetableData = await res.json();
	} catch (err) {
		console.error(err);
		return err;
	}
	return timetableData;

}
