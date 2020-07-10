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
  if (addr.hostname == "search.yahoo.com") {
    var query = addr.searchParams.get("p");
  } else {
    var query = addr.searchParams.get("q");
  }
  return query;
};

function redirect(details) {
  var addr = new URL(details.url);
  var query = get_search_query(addr);
  var new_addr;
  if (addr.hostname == "www.google.com" && addr.pathname == "/url") {
    new_addr = query;
  }
  if (query) {
    if (!new_addr) {
      var new_addr = "https://duckduckgo.com/?q=" + query;
    }
    var updating = browser.tabs.update(details.tabId, {url: new_addr});
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
