// var express = require('express');
import express from 'express';
var app = express();

app.use(express.static(__dirname + '/public'));

var port = 3000;
app.listen(port);
console.log('Server on : ', port);