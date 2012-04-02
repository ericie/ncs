statusBoard = null;

start = ()->
	console.log "Hello, NCS Dashboard."

	ncs.connect location.host, 'ncs_dashboard', ()->
		statusBoard = new NCSStatusBoard $($('.ncs-dashboard')[0])

		# ncs.onreceive (_key, _value)->
		# 	console.log _key, _value

		


class NCSStatusBoard
	constructor: (@parent)->
		@table = $ """<table class = "status">"""
		@parent.append @table

		ncs.getSocket().on 'ncs_status_response', (_status)->
			statusBoard.updateStatus(JSON.parse _status)

		every 2000, ()->
			ncs.getSocket().emit 'ncs_status_request'


	updateStatus: (_status)->
		@table.empty()

		if _status.length
			#build head
			thead = $ """<thead>"""
			for key, value of _status[0]
				td = $ """<td class="#{key}">#{key}</td>"""
				thead.append td
			@table.append thead

			#build content
			for row in _status
				tr = $ """<tr>"""
				for key, value of row
					td = $ """<td class="#{key}">#{value}</td>"""
					tr.append td

				@table.append tr





every = (_ms, _callback) -> 
	setInterval _callback, _ms





$ start