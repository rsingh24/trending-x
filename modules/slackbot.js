/**
 * Created by htomar on 11/02/2017.
 */

"use strict";
/** Module dependencies. */
const botKit = require('botkit');
const os = require('os');
const winston = require('winston');
const akamaiHelper = require('./akamai-helper');
const orderHelper = require('./order-helper');

/** BotKit Controller */
const controller = botKit.slackbot({
    debug: false,
});
/** Initializing Bot connection */
const bot = controller.spawn({
    token: 'xoxb-140972453015-Q9JPhfdC7kUFmPGHb3fClZBz'
}).startRTM();

/** Initializing wit.ai object */
var wit = require('botkit-witai')({
    accessToken: 'URZPOAV7F6NBYQAZTV27UHU2BFQP6DNH',
    minConfidence: 0.4
});

/** Add wit.ai as bokit middleware */
controller.middleware.receive.use(wit.receive);

/** Initialize logger and log format */
const moduleName = 'bot:';
const tsFormat = () => (new Date()).toLocaleString();
const logger = new (winston.Logger)({
    transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'info'
        })
    ]
});

controller.hears(['gtm'], 'direct_message,direct_mention,mention', wit.hears, function (bot, message) {
    logger.info('Wit.ai detected entities', message.entities);
    var env = 'prod';
    if(null !== message.entities.env && undefined !== message.entities.env) {
        env = message.entities.env[0].value;
    }
    bot.reply(message,'Fetching GTM status for ' + env);
    akamaiHelper.getGTMStatus(env, function (gtmStatus) {
        bot.reply(message, gtmStatus);
    });
});

controller.hears(['order_count'], 'direct_message,direct_mention,mention', wit.hears, function (bot, message) {
    logger.info('Wit.ai detected entities', message.entities);
    if(undefined !== message.entities.datetime && null !== message.entities.datetime) {
        var dateTime = message.entities.datetime[0];
        var extractedString = orderHelper.extractDetails(dateTime);
        logger.info('Extracted Details :' + extractedString);
        bot.reply(message,extractedString);
    }
});
