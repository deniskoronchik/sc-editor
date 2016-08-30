var Log = require('electron-log');
var ui = require('./ui');

function initPluginImpl() {
  ui.register();
}

function shutdownPluginImpl() {
  ui.unregister();
}

module.exports = {
  initPlugin        : initPluginImpl,
  shutdownPlugin    : shutdownPluginImpl
};
