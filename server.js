        var os = require('os');
        var exec = require('child_process').exec, child;
        var pty = require('node-pty');
        var Terminal = require('xterm').Terminal;
        var express = require('express');

        var sock = express();
        // Initialize node-pty with an appropriate shell
        var expressWs = require('express-ws')(sock);

        // Serve static assets from ./static

        sock.use(express.static(__dirname + "/static"));

        // Instantiate shell and set up data handlers

        expressWs.app.ws('/shell', function (ws, req) {

          // Spawn the shell
          var bash = os.platform() === 'bash'

          var shell = pty.spawn('/bin/sh', ['--login'], {

            name: 'xterm-color',

            cols: 50,

            rows:30,

            cwd: '../../Applications/wrench.app/Contents/Resources/app',

            env: process.env

          });

          // For all shell data send it to the websocket

          shell.on('data', function (data) {

            ws.send(data);

          });

          // For all websocket data send it to the shell

          ws.on('message', function (msg) {

            shell.write(msg);

          });


        });

                  // Start the application

        sock.listen(9000);
        
        let shellEntry = exec('/usr/bin/dscl . -read /Users/$LOGNAME UserShell');
        let shellReturn = Object.values(shellEntry);
        let userShell = shellReturn[10];
        console.log(userShell);


        Terminal.applyAddon(attach);
        Terminal.applyAddon(fit);
        var term = new Terminal();

        term.setOption('theme', {
          background: '#f5f5f5',
          foreground: '#4b5a75',
          cursor: '#4b5a75'
        });
        term.open(document.getElementById('term'));
        const socket = new WebSocket('ws:localhost:9000/shell');
        term.attach(socket); 
        term.fit();
        // socket.send(shellEntry + ' --login\r');

  function sendCommand() {
    document.getElementById('start-btn').style.color = "lightgrey";
    document.getElementById('stop-btn').style.color = "red";
    var cmd = ipcRenderer.sendSync('start', true);
    socket.send(cmd+'\r');
}

function killProcess() {
    document.getElementById('start-btn').style.color = "limegreen";
    document.getElementById('stop-btn').style.color = "lightgrey";
  let cmd = ipcRenderer.sendSync('kill', true)
  socket.send(cmd);
}
  // function bust() {
    // var cmd = ipcRenderer.sendSync('cache', true);
    // socket.send(cmd+'\r');
// }
  // function push() {
    // var cmd = ipcrenderer.sendsync('push', true);
    // socket.send(cmd+'\r');
// }
  // function pull() {
    // var cmd = ipcrenderer.sendsync('pull', true);
    // socket.send(cmd+'\r');
// }
//
