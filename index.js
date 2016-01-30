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
  var taburl = tab.url
  if ((taburl.startsWith('www.google.com') || taburl.startsWith('https://www.google.com')) || taburl.startsWith('http://www.google.com')) {
    if (taburl.indexOf('/search?') != -1) {
      var search = taburl.slice(taburl.indexOf('?q'));
      console.log('Redirecting...')
      tab.url = 'https://duckduckgo.com/' + search;
    }
    else {
      console.log('Not going to redirect.');
    }
    console.log(taburl);
    
  }
});
