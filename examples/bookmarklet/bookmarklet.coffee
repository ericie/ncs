


#util
loadJS = (_src, _callback)->
	script = document.createElement('script');
	script.onload = ()->
		if typeof _callback == "function"
			_callback()
	script.src = _src
	document.getElementsByTagName('head')[0].appendChild script

loadCSS = (_src, _callback)->
	css = document.createElement('link');
	css.href = _src
	css.rel = 'stylesheet'
	document.getElementsByTagName('head')[0].appendChild css

loadCSS "http://localhost:8080/examples/multimouse/css/multimouse.css", ()->

loadJS "http://localhost:8080/examples/share/js/libs/jquery-1.7.1.min.js",  ()->
	loadJS "http://localhost:8080/client/ncs_client.js", ()->
		loadJS "http://localhost:8080/examples/multimouse/js/multimouse.js", ()->
			alert "done!"
