// @majordomo slack bot

module.exports = {
    show_github_issue : {
        pattern: /#(\d+)/
    },
    say : {
        master_only: true,
        pattern: /^say\s*(.+)/
    }
};

