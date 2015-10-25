var fs = require('fs');
var Monitor = require('../index');

function getCreds() {
  try {
    var data = fs.readFileSync('creds.json');
    return JSON.parse(data);
  } catch(e) { }
}

var creds = getCreds();
if(!creds) {
  console.log("Failed to find creds.json with ");
  console.log("{consumer_key, consumer_secret, access_token_key, access_token_secret}");
  process.exit();
}

var monitor = new Monitor(creds, "node", function(newTweets, totalTweets) {
  newTweets.forEach(function(tweet) {
    console.log(tweet.text);
    console.log();
  });

  console.log("TOTAL: ", totalTweets);
});