# http-ws-bridge

HTTP to websocket bridge provides a way for websocket clients to receive updates by posting to an http endpoint.

## HTTP - WebSocket

    ws.js

Provides the main code to bridge http to ws.

Listens for websocket clients on port 4201 and enables messaging between them.

Listens on port 4202 for http posts and sends the message to the websocket clients.

## Web Client

    index.html

This is a crude webpage with a websocket client. It connects to the
websocket server to be able to send and receive messages.

Note: To get this running on your system you will need to edit this file to change the IP address it uses to connect to the websocket server.

## Webserver

    index.js

This is a simple webserver. It is setup to listen on port 4200.
Use this as a quick way to serve a web page.

## How to use

Before you begin, make sure that everything is set up.

1. Make sure that nodejs is installed.
2. Run `npm install` to get all the required npm modules.

Once that is done, you are ready to start the ws server.

    node ws.js

If you are going to use the index.js webserver, start it.

    node index.js

You can just open the html file directly in the browser.
