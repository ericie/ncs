(function() {
  var after, count, every, screenLog;

  count = 0;

  $(function() {
    console.log("start");
    ncs.connect(location.host, "ncs_test", function() {
      screenLog('sending echo: testing');
      return ncs.send('echo', Date.now());
    });
    ncs.onreceive(function(_key, _value) {
      var i, time;
      if (_key === 'echo') {
        time = Date.now() - _value;
        screenLog("received echo(" + _value + ") in " + time + "ms # " + (count++));
      }
      if (_key === 'flood') {
        screenLog("got flood", _value.fps, _value.duration);
        i = every(1000 / _value.fps, function() {
          screenLog('sending echo: testing');
          return ncs.send('echo', Date.now());
        });
        return after(_value.duration, function() {
          screenLog('DONE DONE DONE');
          screenLog('DONE DONE DONE');
          return clearInterval(i);
        });
      }
    });
    $("#send").click(function(event) {
      screenLog('sending echo: testing');
      return ncs.send('echo', Date.now());
    });
    return $("#flood").click(function(event) {
      if (!confirm("Really? Truly?")) return;
      screenLog('sending echo: flooding');
      return ncs.send('flood', {
        fps: 50,
        duration: 5000
      });
    });
  });

  screenLog = function(_value) {
    return $("#console").append($("<tr><td>" + (_value.toString()) + "</td></tr>"));
  };

  every = function(_ms, _callback) {
    return setInterval(_callback, _ms);
  };

  after = function(_ms, _callback) {
    return setTimeout(_callback, _ms);
  };

}).call(this);
