const known = {
  "Google": {regex: "^www.google.com/search$", params: ["q"], enabled: true},
  "Bing": {regex: "^www.bing.com/search$", params: ["q"], enabled: true},
  "Yahoo": {regex: "^search.yahoo.com/search$", params: ["p"], enabled: true},
  "Visual Studio": {regex: "^bingdev.cloudapp.net/BingUrl.svc/Get", params: ["mainLanguage", "errorCode"], enabled: true}
};

function get_search_query(addr) {
  // Looks like "www.google.com/search"
  const addrBase = `${addr.hostname}${addr.pathname}`;

  for (let searchProvider in known) {
    const search = known[searchProvider];

    // The enabled status is updated in real time through storage change events
    if (!search.enabled) {
      continue;
    }

    const regex = new RegExp(search.regex);

    if (regex.test(addrBase)) {
      // If search provider is enabled and matches, return the query string comprising space-separated parameters
      return search.params.map(param => addr.searchParams.get(param)).join(" ");
    }
  }

  // null if no matches
  return null;
};

function redirect(details) {
  // Only redirect in top level contexts
  if (details.parentFrameId !== -1 || details.frameId !== 0) {
    return;
  }

  // Check for search engines
  const addr = new URL(details.url);
  const query = get_search_query(addr);

  if (query) {
    return {
        redirectUrl: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
    }
  }
};

browser.webRequest.onBeforeRequest.addListener(redirect, {urls: ["<all_urls>"]}, ["blocking"]);

function on_storage_change(changes, area) {
  if (area === "sync" && changes.known) {
    for (let key in changes.known.newValue) {
      known[key].enabled = changes.known.newValue[key];
    }
  }
}

// Bind known-object to storage
browser.storage.sync.get("known").then(res => {
  if (res.known) {
    for (let key in res.known) {
      known[key].enabled = res.known[key];
    }
  } else {
    // Initialize if property was not set
    const providers = {};
    for (let key in known) {
      providers[key] = known[key].enabled;
    }

    browser.storage.sync.set({known: providers});
  }

  browser.storage.onChanged.addListener(on_storage_change);
});
