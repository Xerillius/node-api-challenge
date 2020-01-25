const express = require('express');
const server = express();

server.use(express.json());

const actionRouter = require('./routers/actionRouter');
const projectRouter = require('./routers/projectRouter');



server.use('/actions', actionRouter);
server.use('/projects', projectRouter);

server.get('/', (req, res) => {
    res.send(`<h2>Lambda API Sprint Challenge<h2>`);
});

module.exports = server;