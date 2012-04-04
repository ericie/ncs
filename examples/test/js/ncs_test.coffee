#start
$ ()->
	console.log "start"
	ncs.connect location.host, "ncs_test", ()->
		screenLog 'sending echo: testing'
		ncs.send 'echo', Date.now()

	ncs.onreceive (_key, _value)->
		if _key == 'echo'
			time = Date.now() - _value
			screenLog """received echo(#{_value}) in #{time}ms"""

	$("#send").click (event)->
		screenLog 'sending echo: testing'
		ncs.send 'echo', Date.now()

#util
screenLog = (_value)->
	$("#console").append $ """<tr><td>#{_value.toString()}</td></tr>"""


