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
      this.table = $("<table class = \"status\">");
      this.parent.append(this.table);
      ncs.getSocket().on('ncs_status_response', function(_status) {
        return statusBoard.updateStatus(JSON.parse(_status));
      });
      every(2000, function() {
        return ncs.getSocket().emit('ncs_status_request');
      });
    }

    NCSStatusBoard.prototype.updateStatus = function(_status) {
      var key, row, td, thead, tr, value, _i, _len, _ref, _results;
      this.table.empty();
      if (_status.length) {
        thead = $("<thead>");
        _ref = _status[0];
        for (key in _ref) {
          value = _ref[key];
          td = $("<td class=\"" + key + "\">" + key + "</td>");
          thead.append(td);
        }
        this.table.append(thead);
        _results = [];
        for (_i = 0, _len = _status.length; _i < _len; _i++) {
          row = _status[_i];
          tr = $("<tr>");
          for (key in row) {
            value = row[key];
            td = $("<td class=\"" + key + "\">" + value + "</td>");
            tr.append(td);
          }
          _results.push(this.table.append(tr));
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
