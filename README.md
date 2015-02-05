# @majordomo slack bot

Simple [bot](https://api.slack.com/rtm) to interact with external services from [slack](http://slack.com/).

## Setup

* Add a bot integration to slack, call it `majordomo`; use the provided token as `SLACK_TOKEN` in `majordomo.js`.
* Add an [incoming webhook](https://api.slack.com/incoming-webhooks) integration to slack; use the provided URL as `SLACK_WEBHOOK` in `majordomo.js`.
* Configure `plugins/index.js`.

## Install

* Node.js is required
* Node packages: `npm slackbotapi request jethro slackihook forever`

## Operation

    cd /path/to/majordomo
    forever start majordomo.js

## Plugin options

* `pattern`: a regular expression that triggers the plugin. The first captured parens will be passed as first parameter to the plugin. 
* `master_only`: boolean indicating if the plugin obeys only to master nick. The master nick name is hard-coded in `majordomo.js`.
* `users`: an array with the allowed users. User names without hash.

## Plugin signature

    function(captured_paren, data, slack, hook) {
    }

* `captured_paren` is the first captured parens in the configured pattern.
* `data` is the received slack data (`data.channel`, `data.user`, `data.text`).
* `slack` is the slack interface (`slack.sendMsg(channel, message)`).
* `hook` is the incoming webhook interface (`hook.send(message, callback)`).

## Plugin: say

Ask @majordomo to say something in a specific channel.

Example: say 'morning in #general

## Plugin: github issues

Send a webhook message [with the issue overview](https://developer.github.com/v3/issues/#get-a-single-issue) every time someone mentions the issue number prefixed with `#`.

* Setup with a token, owner and repo in `plugins/show_github_issue.js`.

