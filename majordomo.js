// @majordomo slack bot

const DEV = false;

// Master user nick
var MASTER_NICK;

// Slack API
var SLACK_TOKEN;
var SLACK_WEBHOOK;

if (DEV) {
    // your slack team
    SLACK_TOKEN = "<#token#>";
    SLACK_WEBHOOK = "<#webhook#>";
    MASTER_NICK = "<#username-without-hash#>";
}
else {
    // run with different slack team for development
    SLACK_TOKEN = "<#token#>";
    SLACK_WEBHOOK = "<#webhook#>";
    MASTER_NICK = "<#username-without-hash#>";
}

// Logger
var logger = require('./lib/logger');
logger.V = false; // true to enable logging

// Slack 
var slackAPI = require('slackbotapi');
var slack = new slackAPI(SLACK_TOKEN);

// Slack Incoming Webhooks
var WebHook = require('slackihook')
inc_hook = new WebHook(SLACK_WEBHOOK);

// Plugins
var plugins = require("./plugins/")

var master_user = null;

// Slack on EVENT message, send data.
slack.on('message', function(data) {
    logger.debug(data, 'incoming data');

	// If no text, return
	if (typeof data.text == 'undefined') return;
    // If from a bot, return
    if (typeof data.subtype != 'undefined' && data.subtype == 'bot_message') return;

    if (!master_user) {
        try {
            if (slack.getIM(MASTER_NICK).user == data.user) {
                logger.success("Your wish is my command, oh master.");
                slack.sendMsg(data.channel, 'Your wish is my command, oh master! :raised_hands:');
                master_user = data.user;
            }
        } 
        catch(ex) {/* pass */}
    }

    var is_master = false;
    if (master_user == data.user) {
        is_master = true;
    }

    var match;
    for(var plugin_name in plugins) {
        var plugin = plugins[plugin_name];
        if (plugin.master_only && !is_master) {
            continue; // for the master only
        }
        if (plugin.users) {
            var access_granted = false;
            for(var u = 0; u < plugin.users.length; u++) {
                var nick = plugin.users[u];
                logger.debug(nick, 'nick');
                try {
                    if (slack.getIM(nick).user == data.user) {
                        logger.success('Access granted to ' + nick);
                        access_granted = true;
                        break;
                    }
                } 
                catch(ex) {/* pass */}
            }
            if (! access_granted) {
                continue; // for some users only
            }
        }
        if ((match = data.text.match(plugin.pattern))) {
            logger.info('Plugin: ' + plugin_name);
            require('./plugins/' + plugin_name)(match[1], data, slack, inc_hook);
            break; // first matching plugin wins
        }
    }
});


