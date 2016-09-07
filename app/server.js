var SctpClient = require('sc-network');
var Q = require('q');
var net = require('net');

server = {};

function SctpConnection(options) {
  var host = 'localhost';
  var port = 56789;

  if (options.host) {
    host = options.host;
  }
  if (options.port) {
    port = options.port;
  }

  var sctp_client = null;

  return {

    connect: function() {
      var dfd = new Q.defer();
      var socket = new net.Socket();

      socket.on('error', function() {
        dfd.resolve(false);
      });

      socket.connect(port, host, function() {
        sctp_client = new SctpClient.SctpClient(socket);
        dfd.resolve(true);
      });

      return dfd.promise;
    },

    client: function() {
      return sctp_client;
    }

  };
}

server.sctp_connect = null;

/* Connect options:
 * - host - host to connect. Example: localhost
 * - port - port for connecting. Example: 55770
 */
server.connect = function (options) {
  var sctp_connect = new SctpConnection(options);
  server.sctp_connect = sctp_connect;
  server.client = sctp_connect.client;

  var dfd = new Q.defer();
  sctp_connect.connect().then(function(state) {
    server.keynodes = new SctpClient.Keynodes(sctp_connect.client());
    dfd.resolve(state);
  });
  return dfd.promise;
}

module.exports = server;
