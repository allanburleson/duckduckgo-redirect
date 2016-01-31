const self = require("sdk/self");
const tabs = require("sdk/tabs");
const events = require("sdk/system/events");
const chrome = require("chrome");

function listener(event) {
  var channel = event.subject.QueryInterface(chrome.Ci.nsIHttpChannel);
  var replace = false;
  var firstURL = event.subject.URI.spec;
  if(firstURL.match(/^https*:\/\/www\.google\.com/)) {
    var searchre = /[\?#&]q=[a-z\+%0-9@\/-;\.<>,\(\)]*/i;
  }
  else if (firstURL.match(/^https*:\/\/www\.bing\.com/)) {
    var searchre = /[\?#&]q=[a-z\+%0-9@\/-;\.<>,\(\)]*/i;
  }
  else if (firstURL.match(/^https*:\/\/search\.yahoo\.com/)) {
    var searchre = /[\?#&]p=[a-z\+%0-9@\/-;\.<>,\(\)]*/i;
  }
  else {
    searchre = null;
  }
  if (searchre != null) {
    var ioService = chrome.Cc["@mozilla.org/network/io-service;1"].getService(chrome.Ci.nsIIOService);
    var newURL = 'https://duckduckgo.com';
    if (firstURL.indexOf('/search?') != -1) {
      
      var search = firstURL.slice(firstURL.indexOf('.com/') + 4);
      if (searchre.test(search)) {
        search = '?q' + search.match(searchre)[0].slice(2);
      }
    }
    else {
      var search = '';
    }
    newURL += search;
    var newURI = ioService.newURI(newURL, event.subject.URI.originCharset, null);
    channel.redirectTo(newURI);
  }
  return;
}

events.on("http-on-modify-request", listener);
