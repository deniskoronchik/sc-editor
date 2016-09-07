const Q = require('q');
const Log = require('electron-log');
const Path = require('path');
const ui = require('./ui');

/// TODO: move to ui
var nl_keynodes = [
  'main_nl_dialogue_instance',
  'command_finished',
  'command_process_user_text_message',
  'self',
  'rrel_last_item',
  'nrel_author',
  'nrel_translation'
];

var interfaces = [];

function initPluginImpl(kb_server) {
  var dfd = new Q.defer();

  kb_server.keynodes.resolveKeynodes(nl_keynodes).then(function (result) {
    nl_keynodes = result;

    interfaces.push({
        name: 'NL',
        type: 'UI',
        displayName: "Natural Language",
        icon: Path.resolve(__dirname, 'nl-ui-card.png'),
        description: "Talk with system by using natural language",
        factory: function($container) {
          return new ui.factory($container, kb_server.client(), nl_keynodes);
        }
    });

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
  interfaces        : interfaces
};
