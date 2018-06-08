var filter = {
  url:
  [
    {hostContains: 'google.com'},
    {hostContains: 'bing.com'},
    {hostContains: 'yahoo.com'}
  ]
};

function get_query(url) {
  // Finds search query in url
  // 1st capture group contains only query itself
  if (url.includes('search.yahoo.com')) {
    var re = /[\?#&]p=([^&?#]+)/i;
  } else {
    var re = /[\?#&]q=([^&?#]+)/i;
  }
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
  // Changes URL to newurl
  // Current problems with opening search in new tab
  var updating = browser.tabs.update({url: newurl});
  
};

browser.webNavigation.onBeforeNavigate.addListener(redirect, filter);
