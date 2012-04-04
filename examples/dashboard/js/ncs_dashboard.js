(function() {
  var NCSStatusBoard, every, start, statusBoard;

  statusBoard = null;

  start = function() {
    console.log("Hello, NCS Dashboard.");
    return ncs.connect(location.host, 'ncs_dashboard', function() {
      return statusBoard = new NCSStatusBoard($($('.ncs-dashboard')[0]));
    });
  };

  NCSStatusBoard = (function() {

    function NCSStatusBoard(parent) {
      this.parent = parent;
      this.statsTable = $("<table class = \"stats\">");
      this.parent.append(this.statsTable);
      this.connectionsTable = $("<table class = \"connections\">");
      this.parent.append(this.connectionsTable);
      ncs.getSocket().on('ncs_status_response', function(_status) {
        return statusBoard.updateStatus(JSON.parse(_status));
      });
      ncs.getSocket().emit('ncs_status_request');
      every(2000, function() {
        return ncs.getSocket().emit('ncs_status_request');
      });
    }

    NCSStatusBoard.prototype.updateStatus = function(_status) {
      var hours, interval, key, minutes, row, td, thead, tr, value, _i, _len, _ref, _ref2, _ref3, _results;
      _status.stats.start_time = new Date(_status.stats.start_time).format("yyyy-mm-dd HH:MM");
      interval = new Date() - new Date(_status.stats.start_time);
      hours = Math.floor(interval / (3600 * 1000));
      minutes = Math.floor((interval % (3600 * 1000)) / (60 * 100)) / 10.0;
      _status.stats.uptime = "" + hours + " hours, " + minutes + " minutes";
      this.statsTable.empty();
      _ref = _status.stats;
      for (key in _ref) {
        value = _ref[key];
        this.statsTable.append($("<tr><td>" + (key.replace("_", " ")) + "</td><td>" + value + "</td></tr>"));
      }
      this.connectionsTable.empty();
      if (_status.connections.length) {
        thead = $("<thead>");
        _ref2 = _status.connections[0];
        for (key in _ref2) {
          value = _ref2[key];
          td = $("<th class=\"" + (key.replace("_", "-")) + "\">" + (key.replace("_", " ")) + "</th>");
          thead.append(td);
        }
        this.connectionsTable.append(thead);
        _ref3 = _status.connections;
        _results = [];
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          row = _ref3[_i];
          tr = $("<tr>");
          for (key in row) {
            value = row[key];
            td = $("<td class=\"" + (key.replace("_", "-")) + "\">" + value + "</td>");
            tr.append(td);
          }
          _results.push(this.connectionsTable.append(tr));
        }
        return _results;
      }
    };

    return NCSStatusBoard;

  })();

  every = function(_ms, _callback) {
    return setInterval(_callback, _ms);
  };

  $(start);

}).call(this);
