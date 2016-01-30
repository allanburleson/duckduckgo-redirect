var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Mozilla",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  tabs.open("https://duckduckgo.com");
}

tabs.on('ready', function(tab) {
  if (tab.url.startsWith('www.google.com') || tab.url.startsWith('https://www.google.com') || tab.url.startsWith('http://www.google.com')) {
    if (tab.url.indexOf('/search?' > -1)) {
      var search = tab.url.slice(tab.url.indexOf('?q'));
    }
    else {
      var search = ''
    }
//    console.log('Opening ddg...');
    tab.url = 'https://duckduckgo.com/' + search;
  }
})
