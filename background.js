var filter = {
  url:
  [
    {hostContains: "google.com"}
  ]
};

function get_query(url) {
  // Finds search query in url
  // 1st capture group contains only query itself
  re = /[\?#&]q=([^&?#]+)/i;
  var match = url.match(re);
  if (match) {
    return match[1];
  } else {
    return null;
  }
};

function redirect(details) {
  var url = details.url;
  var query = get_query(url);
  var newurl = 'https://duckduckgo.com/?q=' + query;
  console.log(url + ' => ' + newurl);
  var updating = browser.tabs.update({url: newurl});
  
};

browser.webNavigation.onBeforeNavigate.addListener(redirect, filter);
