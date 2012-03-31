(function() {
  var MultimousePointer, id, mice;

  mice = {};

  id = Math.floor(Math.random() * 100000);

  MultimousePointer = (function() {

    function MultimousePointer() {
      this.elem = $("<div class=\"multimouse-pointer\"/>");
      $('body').append(this.elem);
    }

    MultimousePointer.prototype.moveTo = function(_x, _y) {
      this.elem.css('left', _x + 'px');
      return this.elem.css('top', _y + 'px');
    };

    return MultimousePointer;

  })();

  $(function() {
    mice[id] = new MultimousePointer;
    ncs.connect(location.host, 'multimouse');
    ncs.onreceive(function(_key, _value) {
      if (_key !== 'mousemove') return;
      if (_value.id === id) return;
      if (!mice[_value.id]) mice[_value.id] = new MultimousePointer;
      return mice[_value.id].moveTo(_value.x, _value.y);
    });
    return $('html').mousemove(function(_e) {
      mice[id].moveTo(_e.pageX, _e.pageY);
      return ncs.send('mousemove', {
        id: id,
        x: _e.pageX,
        y: _e.pageY
      });
    });
  });

}).call(this);
