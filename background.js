// Strict filters make it easy to not accidentally run on unwanted code
const filter = {
  url:
  [
    {hostEquals: "www.google.com", pathPrefix: "/search"},
    {hostEquals: "www.bing.com", pathPrefix: "/search"},
    {hostSuffix: "search.yahoo.com", pathPrefix: "/search"}
  ]
};

const known = {
  Google: {regex: "^www.google.com/search$", param: "q", enabled: true},
  Yahoo: {regex: "search.yahoo.com/search$", param: "p", enabled: true},
  Bing: {regex: "^www.bing.com/search$", param: "q", enabled: true},
};

function get_search_query(addr) {
  // Looks like: "www.google.com/search"
  const addrBase = `${addr.hostname}${addr.pathname}`;

  for (let searchProvider in known) {
    const search = known[searchProvider];

    // The enabled status is updated in real time through storage change events
    if (!search.enabled) {
      return;
    }

    const regex = new RegExp(search.regex);

    if (regex.test(addrBase)) {
      // If search provider is enabled and matches, let's return the parameter from query string
      return addr.searchParams.get(search.param);
    }
  }

  // No matches? Return null
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
    browser.tabs.update(details.tabId, {url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`});
  }
};

browser.webNavigation.onBeforeNavigate.addListener(redirect, filter);

function on_storage_change(changes, area) {
  if (area === 'sync' && changes.known) {
    for (let key in changes.known.newValue) {
      known[key].enabled = changes.known.newValue[key];
    }
  }
}

// Bind known-object to storage
browser.storage.sync.get('known').then(res => {
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
