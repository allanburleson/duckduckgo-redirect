var self = require("sdk/self");
var tabs = require("sdk/tabs");
var events = require("sdk/system/events");
var chrome = require("chrome");

function listener(event) {
  var channel = event.subject.QueryInterface(chrome.Ci.nsIHttpChannel);
  var replace = false;
  var firstURL = event.subject.URI.spec;
  // Find what search engine is being used (if any) and change regex
  if (require("sdk/simple-prefs").prefs['googleredir']) {
    if(firstURL.match(/^https?:\/\/www\.google\.com/)) { 
        var searchre = /[\?#&]q=[a-z\+%0-9@\/-;\.<>,\(\)]*/i;
    }
  }
  if (require("sdk/simple-prefs").prefs['bingredir']) {
    if (firstURL.match(/^https?:\/\/www\.bing\.com/)) {
      var searchre = /[\?#&]q=[a-z\+%0-9@\/-;\.<>,\(\)]*/i;
    }
  }
  if(require("sdk/simple-prefs").prefs['yahooredir']) {
    if (firstURL.match(/^https?:\/\/search\.yahoo\.com/)) {
      var searchre = /[\?#&]p=[a-z\+%0-9@\/-;\.<>,\(\)]*/i;
    }
  }
  else {
    var searchre = null;
  }
  if (searchre != null) {
    // If the variable contains a regex
    var ioService = chrome.Cc["@mozilla.org/network/io-service;1"].getService(chrome.Ci.nsIIOService);
    var newURL = 'https://duckduckgo.com';
    if (firstURL.indexOf('/search') != -1) {
      
      var search = firstURL.slice(firstURL.indexOf('.com/') + 4);
      if (searchre.test(search)) {
        // remove ?q or &q or #q from match and add ?q to ensure URL
        // ... is setup the right way
        search = '?q' + search.match(searchre)[0].slice(2);
      }
    }
    else {
      // don't add anything to the duckduckgo.com URL
      var search = '';
    }
    newURL += search;
    var newURI = ioService.newURI(newURL, event.subject.URI.originCharset, null);
    channel.redirectTo(newURI);
  }
  return;
}

events.on("http-on-modify-request", listener);
