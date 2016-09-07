const Q = require('q');
const Log = require('electron-log');
const Path = require('path');
const ui = require('./ui');

const server = require('../../server');

var nl_keynodes = {
  dialogue: null,
  command_finished: null,
  command_process_user_text_message: null
};

function initPluginImpl() {
  var dfd = new Q.defer();

  server.keynodes.resolveKeynodes(nl_keynodes).then(function (result) {
    nl_keynodes = result;
    dfd.resolve();
  });

  return dfd.promise;
}

function shutdownPluginImpl() {
  var dfd = new Q.defer();
  dfd.resolve();
  return dfd.promise;
}

module.exports = {
  initPlugin        : initPluginImpl,
  shutdownPlugin    : shutdownPluginImpl,
  interfaces        : [
    {
        factory: function($container) {
          return new ui.factory($container);
        },
        icon: Path.resolve(__dirname, 'nl-ui-card.png'),
        description: "Talk with system by using natural language",
        displayName: "Natural Language",
        type: 'UI',
        name: 'NL'
    }
  ]
};
