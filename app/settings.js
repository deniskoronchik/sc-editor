const Config = require('electron-config');

if (global.config == undefined) {
  global.config = new Config({
    "name": "settings",
    "defaults": {
      "sctp_host": 'localhost',
      "sctp_port": '55770',
      "plugins_path": "app/plugins"
    }
  });
}

function set_option(option, value) {
  global.config.set(option, value);
}

function get_option(option) {
  return global.config.get(option);
}

function delete_option(option) {
  global.config.delete(option);
}

function set_option_check(option, value, type) {
  if (typeof value != type)
    throw "You can provide just a " + type + " as a " + option;

  set_option(option, value);
}

// ---

module.exports = {
  set                 : set_option,
  get                 : get_option,
  delete              : delete_option,

  set_sctp_host:
    function(host) {
      set_option_check('sctp_host', host, 'string');
    },

  get_sctp_host:
    function() {
      return get_option('sctp_host');
    },

  set_sctp_port:
    function(port) {
      set_option_check('sctp_port', port, 'number');
    },

  get_sctp_port:
    function() {
      return get_option('sctp_port');
    },

  set_plugins_path:
    function(path) {
      set_option_check('plugins_path', path, 'string');
    },

  get_plugins_path:
    function() {
      return get_option("plugins_path");
    }

};
