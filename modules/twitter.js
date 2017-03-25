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
var handlesLocalVariable = null;

module.exports = {
    streamAllHandles: function() {
            mongoConfig.getEventHandlers(function(handles) {
                console.log('Handles :' + handles);
                handlesLocalVariable = handles.split(',');
                streamHandle(handles);
            });
    }
};

var streamHandle = function(handle) {
    client.stream('statuses/filter', {track: handle},  function(stream) {
        stream.on('data', function(tweet) {
            console.log(tweet.text);
            var detectedHandle = detectHandle(tweet.text);
            if(null != detectedHandle) {
                nlp.analyzeSentiment(tweet.text)
            	.then(function(sentiment) {
            		console.log( 'Sentiment:', sentiment );
                    processSentiment(detectedHandle, sentiment);
            	})
            	.catch(function( error ) {
            		console.log( 'Error:', error.message );
            	})
            }
      });

      stream.on('error', function(error) {
        console.log(error);
      });
    });
};

var processSentiment = function(detectedHandle, sentiment) {
    console.log('Handle:' + detectedHandle + ' sentiment: ' + sentiment.documentSentiment.score);
    mongoConfig.updateSentiments(detectedHandle,sentiment.documentSentiment.score);
};

var detectHandle = function(tweet) {
    var detectedHandle = null;
    if (null !== handlesLocalVariable ) {
        for(var i = 0; i < handlesLocalVariable.length; i++) {
            if(tweet.toLowerCase().indexOf(handlesLocalVariable[i].toLowerCase()) > -1) {
                detectedHandle = handlesLocalVariable[i];
            }
        }
    }
    return detectedHandle;
};
