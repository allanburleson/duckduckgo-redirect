var tabs = require("sdk/tabs");

tabs.on('ready', function(tab) {
  var taburl = tab.url
  var urlre = /^https*:\/\/www\.google.com/
  if (urlre.test(taburl)) {//((taburl.startsWith('www.google.com') || taburl.startsWith('https://www.google.com')) || taburl.startsWith('http://www.google.com')) {
    if (taburl.indexOf('/search?') != -1) {
      var search = taburl.slice(taburl.indexOf('.com/') + 4);
      if (/\?q=[a-z\+%0-9]*/.test(search)) {
        search = search.match(/\?q=[a-z\+%0-9]*/)[0];
        tab.url = 'https://duckduckgo.com/' + search;
      }
      else if (/&q=[a-z\+%0-9]*/.test(search)) {
        search = '?' + search.match(/&q=[a-z\+%0-9]*/)[0].slice(1); // Get search info, remove &, add ?
        tab.url = 'https://duckduckgo.com/' + search;
      }
    }
  }
});
