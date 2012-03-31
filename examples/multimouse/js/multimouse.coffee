# an object to be used as a map to store id->MultimousePointer instance
mice = {}

# a random id for this mouse, one in a million ain't bad
id = Math.floor(Math.random()*100000)

class MultimousePointer
	#create a div on the <body> to represent the mouse
	constructor: () ->
		@elem =  $("""<div class="multimouse-pointer"/>""")	
		$('body').append @elem

	moveTo: (_x, _y)->
		@elem.css 'left', _x + 'px'
		@elem.css 'top', _y + 'px'



# kick off the code when the browser is ready
$ ()->
	# create our pointer instance and associate it with the id
	mice[id] = new MultimousePointer

	# connect to the server
	ncs.connect location.host, 'multimouse'	

	# handle incoming messages
	ncs.onreceive (_key, _value)->
		if _key != 'mousemove' then return  # we only care about mousemove messages
		if _value.id == id then return		# if this message is about us, ignore it

		# if we havn't seen the id before create a new instance for it
		if !mice[_value.id]
			mice[_value.id] = new MultimousePointer

		#move the right MultimousePointer
		mice[_value.id].moveTo _value.x, _value.y


	# handle mouse movement
	$('html').mousemove (_e)->
		mice[id].moveTo _e.pageX, _e.pageY							# move our instance
		ncs.send 'mousemove', {id: id, x: _e.pageX, y: _e.pageY}	# tell the others




