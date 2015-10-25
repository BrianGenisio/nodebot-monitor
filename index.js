'use strict';
var fs = require('fs');
var Twitter = require('twitter');

var filename = 'processed_tweets.json';
var alreadyRead = [];

function processTweets(tweets, callback, forceReport) {
  console.log("PROCESSED " + tweets.statuses.length);
  var unread = tweets.statuses
    .filter(function(tweet) {
      return alreadyRead.indexOf(tweet.id) < 0;
    });

  unread.forEach(function(tweet) {
    alreadyRead.push(tweet.id);
  });

  if(forceReport || unread.length > 0) {
    callback(unread, alreadyRead.length);
  }

  persistList(alreadyRead);
}

function getTweets(client, keywords, callback, forceReport) {
  var lastId = alreadyRead.length ? alreadyRead[alreadyRead.length - 1] : undefined;
  client.get('search/tweets', {q: keywords, since_id: lastId, count: 100}, function(error, tweets, response){
    processTweets(tweets, callback, forceReport);
    setTimeout(function() {
      getTweets(client, keywords, callback);
    }, 5000);
  });
}

function getPersistedList() {
  try {
    var data = fs.readFileSync(filename);
    data = JSON.parse(data);
    alreadyRead = data;
  } catch(e) {}
}

function persistList(data) {
  data = JSON.stringify(data);
  fs.writeFileSync(filename, data);
}

module.exports = function(credentials, keywords, callback) {
  getPersistedList();
  var client = new Twitter(credentials);
  getTweets(client, keywords, callback, true);
}