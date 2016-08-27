const Config = require('electron-config');

if (global.config == undefined) {
  global.config = new Config({
    "name": "settings",
    "defaults": {
      "sctp_host": 'localhost',
      "sctp_port": '55770'
    }
  });
}

settings = {};

function set_option(option, value) {
  global.config.set(option, value);
}

function get_option(option) {
  return global.config.get(option);
}

function delete_option(option) {
  global.config.delete(option);
}

settings.set = set_option;
settings.get = get_option;
settings.delete = delete_option;

// ---
settings.set_sctp_host = function(host) {
  if (typeof host != 'string')
    throw "You can provide just a string as a host";

  set_option('sctp_host', host);
};

settings.get_sctp_host = function() {
  return get_option('sctp_host');
};

settings.set_sctp_port = function(port) {
  if (typeof port != 'number')
    throw "You can provide just an integer number as a port";

  set_option('sctp_port', port);
}

settings.get_sctp_port = function() {
  return get_option('sctp_port');
}

module.exports = settings;
