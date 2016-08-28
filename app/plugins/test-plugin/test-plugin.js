
var Log = require('electron-log');

function initPluginImpl() {
  Log.debug('test-plugin init');
}

function shutdownPluginImpl() {
  Log.debug('test-plugin shutdown');
}

module.exports = {
  initPlugin        : initPluginImpl,
  shutdownPlugin    : shutdownPluginImpl
};
