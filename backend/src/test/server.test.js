const io = require('socket.io-client');
const http = require('http');
const { Server } = require('socket.io');
const supertest = require('supertest');
const express = require('express');
const app = express();

let server, ioServer, clientSocket;

beforeAll((done) => {
  server = http.createServer(app);
  ioServer = new Server(server);

  server.listen(() => {
    const port = server.address().port;
    clientSocket = io(`http://localhost:${port}`);

    ioServer.on('connection', (socket) => {
      socket.on('sendMessage', (msg) => {
        ioServer.emit('message', msg);
      });
    });

    clientSocket.on('connect', done);
  });
});

afterAll(() => {
  ioServer.close();
  clientSocket.close();
  server.close();
});

test('should receive a message', (done) => {
  const testMessage = 'Hello from test';

  clientSocket.emit('sendMessage', testMessage);
  clientSocket.on('message', (msg) => {
    expect(msg).toBe(testMessage);
    done();
  });
});
