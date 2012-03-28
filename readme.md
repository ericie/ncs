NDS
===

Growing into a node.js/socket.io based server + client lib for connecting interactive applications.

Launching NCS
---

in terminal:

		cd path/to/ncs/
		./launch_ncs

in browser:

		http://localhost:8080

Or instead of localhost, the hostname or ip of your server.

The examples are served through the ncs server so you can run them on a local machine without using a seperate http server (like MAMP). Opening the examples from directly from your filesystem (file://) also works in some browsers (Firefox), but not in others (Chrome). See this [issue at github](https://github.com/LearnBoost/socket.io/issues/801)


Requires
---
You need to have node installed and the socket.io module

		cd path/to/ncs/
		npm install socket.io

This creates a node_modules folder in you working directory (if needed) and installs socket.io
