'use strict';

const Twitter = require('twitter');
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const NLP = require('google-nlp');
//	Google Cloud API key
const apiKey = process.env.GOOGLE_NLP_KEY;
var nlp = new NLP(apiKey);

const mongoConfig = require('../mongoconfig');

module.exports = {
    streamAllHandles: function() {
        
    }
};

var streamHandle = function(handle) {
    client.stream('statuses/filter', {track: handle},  function(stream) {

        stream.on('data', function(tweet) {
            console.log(tweet.text);
            nlp.analyzeSentiment(tweet.text)
        	.then(function( sentiment ) {
        		console.log( 'Sentiment:', sentiment );
        	})
        	.catch(function( error ) {
        		console.log( 'Error:', error.message );
        	})
      });

      stream.on('error', function(error) {
        console.log(error);
      });
    });
};
