var filter = {
  url:
  [
    {hostContains: "google.com"},
    {hostContains: "bing.com"},
    {hostContains: "yahoo.com"}
  ]
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
