statusBoard = null;

start = ()->
	console.log "Hello, NCS Dashboard."

	ncs.connect location.host, 'ncs_dashboard', ()->
		statusBoard = new NCSStatusBoard $($('.ncs-dashboard')[0])

		# ncs.onreceive (_key, _value)->
		# 	console.log _key, _value

		


class NCSStatusBoard
	constructor: (@parent)->
		@statsTable = $ """<table class = "stats">"""
		@parent.append @statsTable
		@connectionsTable = $ """<table class = "connections">"""
		@parent.append @connectionsTable



		ncs.getSocket().on 'ncs_status_response', (_status)->
			statusBoard.updateStatus(JSON.parse _status)

		ncs.getSocket().emit 'ncs_status_request'
		every 2000, ()->
			ncs.getSocket().emit 'ncs_status_request'


	updateStatus: (_status)->
		
		# stats
		
		_status.stats.start_time = new Date(_status.stats.start_time).format("yyyy-mm-dd HH:MM");
		interval = new Date() - new Date(_status.stats.start_time)
		hours = Math.floor(interval / (3600 * 1000))
		minutes = Math.floor((interval % (3600 * 1000)) / (60 * 100)) / 10.0
		_status.stats.uptime = """#{hours} hours, #{minutes} minutes"""

		@statsTable.empty()
		for key, value of _status.stats
			@statsTable.append $ """<tr><td>#{key.replace("_"," ")}</td><td>#{value}</td></tr>"""

		


		# connections
		@connectionsTable.empty()
		if _status.connections.length
			#build head
			thead = $ """<thead>"""
			for key, value of _status.connections[0]
				td = $ """<th class="#{key.replace("_","-")}">#{key.replace("_"," ")}</th>"""
				thead.append td
			@connectionsTable.append thead

			#build content
			for row in _status.connections
				tr = $ """<tr>"""
				for key, value of row
					td = $ """<td class="#{key.replace("_","-")}">#{value}</td>"""
					tr.append td

				@connectionsTable.append tr





every = (_ms, _callback) -> 
	setInterval _callback, _ms





$ start