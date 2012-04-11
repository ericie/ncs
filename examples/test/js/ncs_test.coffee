#start
count = 0

$ ()->
	console.log "start"
	ncs.connect location.host, "ncs_test", ()->
		screenLog 'sending echo: testing'
		ncs.send 'echo', Date.now()

	ncs.onreceive (_key, _value)->
		if _key == 'echo'
			time = Date.now() - _value
			screenLog """received echo(#{_value}) in #{time}ms # #{count++}"""

		if _key == 'flood'
			screenLog "got flood", _value.fps, _value.duration
			i = every 1000/(_value.fps), ()->
				screenLog 'sending echo: testing'
				ncs.send 'echo', Date.now()
			after _value.duration, ()->
				screenLog 'DONE DONE DONE'
				screenLog 'DONE DONE DONE'
				clearInterval i

	$("#send").click (event)->
		screenLog 'sending echo: testing'
		ncs.send 'echo', Date.now()

	$("#flood").click (event)->
		if !confirm "Really? Truly?" then return
		screenLog 'sending echo: flooding'
		ncs.send 'flood', {fps: 50, duration: 5000}


#util
screenLog = (_value)->
	$("#console").append $ """<tr><td>#{_value.toString()}</td></tr>"""


every = (_ms, _callback) -> 
	return setInterval _callback, _ms

after = (_ms, _callback) -> 
	return setTimeout _callback, _ms