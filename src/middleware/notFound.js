const express = require('express')
const app = express()

function notFound (req, res) {
    res.sendFile(__dirname + '/NotFoundApp/notFound.html');
    res.status(404);
}

module.exports = {
    notFound
}