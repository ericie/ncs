(function() {
  var loadCSS, loadJS;

  loadJS = function(_src, _callback) {
    var script;
    script = document.createElement('script');
    script.onload = function() {
      if (typeof _callback === "function") return _callback();
    };
    script.src = _src;
    return document.getElementsByTagName('head')[0].appendChild(script);
  };

  loadCSS = function(_src, _callback) {
    var css;
    css = document.createElement('link');
    css.href = _src;
    css.rel = 'stylesheet';
    return document.getElementsByTagName('head')[0].appendChild(css);
  };

  loadCSS("http://localhost:8080/examples/multimouse/css/multimouse.css", function() {});

  loadJS("http://localhost:8080/examples/share/js/libs/jquery-1.7.1.min.js", function() {
    return loadJS("http://localhost:8080/client/ncs_client.js", function() {
      return loadJS("http://localhost:8080/examples/multimouse/js/multimouse.js", function() {
        return alert("done!");
      });
    });
  });

}).call(this);
