// @majordomo slack bot
// Plugin: Show Github Issues
//
// If there is a github issue number mentioned, post title and URL


// Github API Information
const GITHUB_TOKEN = "<#token#>";
const GITHUB_OWNER = "<#owner#>";
const GITHUB_REPO = "<#repo#>";

/** Get an issue by number from github.
 @param number Github issue number.
 @param callback A function that will receive the issue object. */
var github_issue = function(number, callback) {
    var request = require("request");
    var options = {
        uri: 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/issues/' + number.toString() + '?access_token=' + GITHUB_TOKEN,
        method: 'GET',
        headers: {
            'User-Agent': 'Majordomo bot for Slack'
        }
    }; 
    request(options, function(error, response, body) {
        callback(JSON.parse(body));
    });
}

module.exports = function(issue_number, data, slack, hook) {
    if (!issue_number) return;
    github_issue(issue_number, function(issue) {
        var is_pr = issue.pull_request != null;
        var attachments = [{
            "fallback": issue.title,
            "color": "#DDDDDD",
            "title": issue.title,
            "title_link": issue.html_url,
            "text": issue.body,
        }];
        var message = {
            channel: data.channel,
            icon_emoji: ":octocat:",
            attachments: attachments
        };
        if (is_pr) {
            var author = issue.user.login;
            message.username = "Github PR";
            message.text = '#' + issue.number + ' • ' + author + ' • ' + (issue.state == 'open' ? 'Open' : 'Closed');
        }
        else {
            var assignee = issue.assignee ? issue.assignee.login : 'not assigned';
            message.username = "Github Issue";
            message.text = '#' + issue.number + ' • ' + assignee + ' • ' + (issue.state == 'open' ? 'Open' : 'Closed');
        }
        hook.send(message, function(){});
    });
};

