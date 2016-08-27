var ipc = require("electron").ipcRenderer;
var sctp = require("sc-network");

var ui = require("./ui");
var plugins = require("./plugins");
var server = require("./server");
var settings = require('./settings');

/// TODO: cehck if need to login
ui.showContentDimmer("Connecting");

server.connect({
  "host": settings.get_sctp_host(),
  "port": settings.get_sctp_port()
}).then(function(result) {
  ui.hideContentDimmer();
  ui.updateConnectionState(result);
});

ui.init();
