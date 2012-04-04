(function() {
  var screenLog;

  $(function() {
    console.log("start");
    ncs.connect(location.host, "ncs_test", function() {
      screenLog('sending echo: testing');
      return ncs.send('echo', Date.now());
    });
    ncs.onreceive(function(_key, _value) {
      var time;
      if (_key === 'echo') {
        time = Date.now() - _value;
        return screenLog("received echo(" + _value + ") in " + time + "ms");
      }
    });
    return $("#send").click(function(event) {
      screenLog('sending echo: testing');
      return ncs.send('echo', Date.now());
    });
  });

  screenLog = function(_value) {
    return $("#console").append($("<tr><td>" + (_value.toString()) + "</td></tr>"));
  };

}).call(this);
