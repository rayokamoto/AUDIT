var w = globalThis && globalThis.__awaiter || function(a, s, t, e) {
  function u(n) {
    return n instanceof t ? n : new t(function(o) {
      o(n);
    });
  }
  return new (t || (t = Promise))(function(n, o) {
    function d(r) {
      try {
        i(e.next(r));
      } catch (c) {
        o(c);
      }
    }
    function h(r) {
      try {
        i(e.throw(r));
      } catch (c) {
        o(c);
      }
    }
    function i(r) {
      r.done ? n(r.value) : u(r.value).then(d, h);
    }
    i((e = e.apply(a, s || [])).next());
  });
};
const f = "https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_WEEKLY/queryx/*";
let y = 4310, p = 1886739;
function l(a) {
  return w(this, void 0, void 0, function* () {
    let s = a.requestHeaders.find((e) => e.name === "Authorization").value, t;
    try {
      t = yield (yield window.fetch(`https://api.adelaide.edu.au/api/generic-query-structured/v1/?target=/system/TIMETABLE_LIST/queryx/${p},${y}&MaxRows=9999`, {
        headers: {
          "access-control-allow-credentials": "true",
          "access-control-allow-headers": "accept,authorization,access-control-allow-headers,access-control-allow-origin",
          "access-control-allow-methods": "GET,OPTIONS",
          Authorization: s
        }
      })).json();
    } catch (e) {
      return console.error(e), e;
    }
    return browser.webRequest.onBeforeSendHeaders.removeListener(l), t;
  });
}
browser.webRequest.onBeforeSendHeaders.addListener(l, { urls: [f] }, ["blocking", "requestHeaders"]);
