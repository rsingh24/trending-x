'use strict';

var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var unirest = require("unirest");

const NLP = require('google-nlp');
//	Google Cloud API key
const apiKey = process.env.GOOGLE_NLP_KEY;
var nlp = new NLP(apiKey);

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
client.stream('statuses/filter', {track: '#trendingx'},  function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);

    nlp.analyzeSentiment( tweet.text )
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
