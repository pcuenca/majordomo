// @majordomo slack bot
// Say things

module.exports = function(message, data, slack, hook) {
    if (!message) return;

    var match = message.match(/([^#]+?)( in| to)?\s+<\#(\S+)>/);
    if (match) {
        var channel = match[match.length - 1];
        var phrase = match[1];
        slack.sendMsg(channel, phrase);
    }
    else {
        slack.sendMsg(data.channel, message);
    }
};

