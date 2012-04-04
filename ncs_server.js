(function() {
  var ConnectionsList, connections, fs, http, httpHandler, io, path, socketHandler, socketio, start, startsWith, stats;

  http = require('http');

  fs = require('fs');

  path = require('path');

  socketio = require('socket.io');

  io = null;

  connections = null;

  stats = {
    total_messages: 0,
    total_connections: 0,
    start_time: 0
  };

  start = function() {
    var app;
    console.log("Hello, NCS Server.");
    connections = new ConnectionsList;
    stats.start_time = Date.now();
    app = http.createServer(httpHandler);
    app.listen(8080);
    io = socketio.listen(app);
    return io.sockets.on('connection', socketHandler);
  };

  /*
  This is the NCS server.
  */

  socketHandler = function(_socket) {
    var _this = this;
    console.log('new connection');
    stats.total_connections++;
    connections.addConnection(_socket.id);
    _socket.on('disconnect', function() {
      return connections.removeConnection(_socket.id);
    });
    _socket.emit('ncs_hello', 'ncs');
    _socket.on('ncs_hello', function(_name) {
      return connections.updateName(_socket.id, _name);
    });
    _socket.on('ncs_ping_response', function(_data) {
      return connections.updatePing(_socket.id, Date.now() - _data);
    });
    _socket.on('ncs_status_request', function(_data) {
      console.log('ncs_status_request');
      return _socket.emit('ncs_status_response', JSON.stringify({
        stats: stats,
        connections: connections.getStatus()
      }));
    });
    return _socket.on('message', function(_data) {
      stats.total_messages++;
      connections.updateCount(_socket.id);
      return io.sockets.send(_data);
    });
  };

  ConnectionsList = (function() {

    function ConnectionsList() {
      this.connections = {};
    }

    ConnectionsList.prototype.addConnection = function(_id) {
      return this.connections[_id] = {
        id: _id,
        app_name: null,
        transport: io.transports[_id].name,
        ping: null,
        received_messages: 0
      };
    };

    ConnectionsList.prototype.updateName = function(_id, _name) {
      return this.connections[_id].app_name = _name;
    };

    ConnectionsList.prototype.updateCount = function(_id) {
      return this.connections[_id].received_messages++;
    };

    ConnectionsList.prototype.updatePing = function(_id, _ms) {
      return this.connections[_id].ping = _ms;
    };

    ConnectionsList.prototype.removeConnection = function(_id) {
      return delete this.connections[_id];
    };

    ConnectionsList.prototype.getStatus = function() {
      var id, info, status, _ref;
      status = [];
      console.log("status", this.connections);
      _ref = this.connections;
      for (id in _ref) {
        info = _ref[id];
        status.push(info);
      }
      io.sockets.emit('ncs_ping_request', Date.now());
      return status;
    };

    return ConnectionsList;

  })();

  /*
  Very basic http server, simply attempts to send the file in the _req.url
  Intended only for serving tests and examples
  Does check if the file exists, and if the file is in the /test subdirectory
  maybe this should be replaced with express?
  */

  httpHandler = function(_req, _res) {
    var filePath;
    console.log("http request:", _req.url);
    filePath = __dirname + _req.url;
    if (!path.existsSync(filePath)) {
      console.log('not found');
      _res.writeHead(404);
      return _res.end('not found');
    }
    console.log("file:", filePath);
    filePath = fs.realpathSync(filePath);
    if ((!startsWith(__dirname + '/examples/', filePath)) && (!startsWith(__dirname + '/client/', filePath))) {
      console.log('bad path: redirecting');
      _res.writeHead(302, {
        'Location': '/examples/index.html'
      });
      return _res.end();
    }
    return fs.readFile(filePath, function(_err, _data) {
      if (_err) {
        console.log("error");
        _res.writeHead(500);
        return _res.end('error');
      }
      console.log('success');
      _res.writeHead(200);
      return _res.end(_data);
    });
  };

  startsWith = function(_needle, _haystack) {
    return _haystack.substr(0, _needle.length) === _needle;
  };

  start();

}).call(this);
