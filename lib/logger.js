// Logger
//

var Logger = require('jethro');
if (Logger.core.initialised === false) {
    Logger.init();
}

var log = function(data, severity) 
{
    if (!severity) severity = 'debug';
    Logger.output({severity:severity, source:'majordomo', message: data, timestamp: new Date()});
}

module.exports = {
    info: function(data){if (this.V) log(data, 'info');},
    debug: function(data, name){if (this.V) log((name ? (name + ': ') : '') + JSON.stringify(data), 'debug');},
    warning: function(data){if (this.V) log(data, 'warning');},
    error: function(data){if (this.V) log(data, 'error');},
    success: function(data){if (this.V) log(data, 'success');},
    V : false
}
