const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

const cache = {};
const server = http.createServer((request, response) => {
  let filePath = false;
  if (request.url == '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + request.url;
  }
  const absPath = './' + filePath;
  serveStatic(response, cache, absPath);
});

function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
}

function sendFile(fileContents) {
  response.writeHead(
    200,
    {'Content-type': mime.lookup(path.basename(filePath))}
  );
  response.end(fileContents)
}

function serveStatic(response, cache, absPath) {
  "use strict";
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, (exists) => {
      if (exists) {
        fs.readFile(absPath, (err, data) => {
          if(err) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        });
      } else {
        send404(response);
      }
    });
  }
}

