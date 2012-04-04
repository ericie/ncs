http = require 'http'
fs = require 'fs'
path = require 'path'
socketio = require 'socket.io'
io = null


connections = null
stats = {total_messages: 0, total_connections: 0, start_time: 0}


# Main entry point of the program. Called at end of file so that all the functions will be available when this runs.
start = ()->
	console.log "Hello, NCS Server."
	connections = new ConnectionsList
	stats.start_time = Date.now()

	app = http.createServer(httpHandler)
	app.listen 8080
	io = socketio.listen app
	# io.set('origins', "*.*"); 
	io.sockets.on 'connection', socketHandler




###
This is the NCS server.
###


socketHandler = (_socket)->

	# welcome new connections

	console.log 'new connection' #, _socket
	stats.total_connections++;

	connections.addConnection _socket.id
	_socket.on 'disconnect', ()=>
		connections.removeConnection _socket.id
	_socket.emit 'ncs_hello', 'ncs'

	# handle ncs protocol messages

	_socket.on 'ncs_hello', (_name)->
		connections.updateName _socket.id, _name

	_socket.on 'ncs_ping_response', (_data)->
		connections.updatePing _socket.id, Date.now() - _data

	_socket.on 'ncs_status_request', (_data)->
		console.log 'ncs_status_request'
		_socket.emit 'ncs_status_response', JSON.stringify {stats: stats, connections: connections.getStatus()}

	# handle application messages

	_socket.on 'message', (_data)->
		stats.total_messages++;
		connections.updateCount _socket.id
		io.sockets.send _data



class ConnectionsList
	constructor: ()->
		@connections = {}

	addConnection: (_id)->
		@connections[_id] = 
			id: _id
			app_name: null
			transport: io.transports[_id].name
			ping: null
			received_messages: 0

		
	updateName: (_id, _name)->
		@connections[_id].app_name = _name

	updateCount: (_id)->
		@connections[_id].received_messages++

	updatePing: (_id, _ms)->
		@connections[_id].ping = _ms

	removeConnection: (_id)->
		delete @connections[_id]

	getStatus: ()->
		status = []
		console.log "status", @connections
		for id, info of @connections
			status.push info

		#get pings for next time
		io.sockets.emit 'ncs_ping_request', Date.now()
		return status


###
Very basic http server, simply attempts to send the file in the _req.url
Intended only for serving tests and examples
Does check if the file exists, and if the file is in the /test subdirectory
maybe this should be replaced with express?
###
httpHandler = (_req, _res)->
	console.log "http request:", _req.url
	filePath = __dirname + _req.url

	if !path.existsSync(filePath)
		console.log 'not found'
		_res.writeHead 404
		return _res.end 'not found'

	console.log "file:", filePath

	filePath = fs.realpathSync(filePath)
	if (!startsWith __dirname + '/examples/', filePath) && (!startsWith __dirname + '/client/', filePath)
		console.log 'bad path: redirecting'
		_res.writeHead 302, {'Location':'/examples/index.html'}
		return _res.end()

	fs.readFile filePath, (_err, _data)->
		if _err
			console.log "error"
			_res.writeHead 500
			return _res.end 'error'
		
		console.log 'success'
		_res.writeHead 200
		_res.end _data


# Util
startsWith = (_needle, _haystack)->
	return _haystack.substr(0, _needle.length) == _needle


start()



