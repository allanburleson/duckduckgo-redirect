var tabs = require("sdk/tabs");

tabs.on('ready', function(tab) {
  var taburl = tab.url
  if ((taburl.startsWith('www.google.com') || taburl.startsWith('https://www.google.com')) || taburl.startsWith('http://www.google.com')) {
    if (taburl.indexOf('/search?') != -1) {
      var search = taburl.slice(taburl.indexOf('?q'));
      tab.url = 'https://duckduckgo.com/' + search;
    }
  }
});
