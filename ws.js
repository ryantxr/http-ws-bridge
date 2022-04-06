/*
This is a crude http -> ws bridge.
It listens for websocket connections on port 4201.
From there, clients can send messages which are sent to all connected clients.
It then listens on port 4202 for http requests.
When an HTTP request comes in, it forwarded to the websocket clients.
*/
const config = {
    wsPort: 4201,
    httpPort: 4202
}

const WebSocket = new require('ws');
const http = new require('http');

const wss = new WebSocket.Server({port: config.wsPort});
// const qs = require('querystring');

/*
    Keep a list of the client sockets.
    As clients join and leave, this list is updated.
*/
// let clients = [];
let clients = new Set();
// Send to all the clients
function send(message) {
    clients.forEach(s => {
        console.log(`sending ${message}`);
        // s.send('msg');
        s.send(message);
    });
}

// Set up the websocket connection
wss.on('connection', ws => {
    // clients.push(ws);
    console.log("someone connected");
    clients.add(ws);
    
    // When we receive a message
    ws.on('message', message => {
        // console.log(message);
        // console.log(message.toString());
        // message is a buffer, so it has to be converted into a string.
        console.log(`Received message => ${message}`);
        let m = message.toString();// convert buffer to string
        send(m);
    });

    // When the connection closes
    ws.on('close', function() {
        console.log("socket closed");
        // Remove from the client list
        clients.delete(ws);
    });
    // Send an initial message.
    ws.send('Hello! Message From Server!!');
});

/*
Set up the http listener
*/
server = http.createServer((req, res) => {
    var data = '';
    var body = '';

    /*
    The body has to be read in chunks because it is streamed.
    */
    // Read the body in chunks
    // This gets called multiple times until the entire body is read.
    req.on('data', chunk => {
        console.log(`Data chunk available: ${chunk}`);
        data += chunk;
        body += data;
    })
    var post = {text:null};
    
    // Finished reading the body
    // This gets called when the entire body has been read.
    req.on('end', () => {
        // Setup the post object default
        post = {text:null};

        // end of data
        // console.log(JSON.parse(data).text);
        const searchParams = new URLSearchParams(body);
        // Walk through the body and add the key/values to 
        // the post object
        for(var pair of searchParams.entries()) {
            // console.log(pair[0]+ ', '+ pair[1]);
            post[pair[0]] = pair[1];
        }
        // I did it this way at first.
        // Can be removed.
        if ( searchParams.has('text') ) {
            post.text = searchParams.get('text');
        } else {
            post.text = null;
        }
        // Send to clients.
        send(post.text);
        // var post = qs.parse(body);
        console.log(data);
        // Respond to caller.
        // Write response as Html(text)
        res.writeHead(200, {'Content-Type': 'text/html'});
        // Writing static text
        let nl = '\n';
        res.end('response:' + nl + post.text + nl + 'OK' + nl);
    });

});

// Make the http server start listening
server.listen((config.httpPort), () => {
    console.log("HTTP Server is running on port " + config.httpPort);
});
