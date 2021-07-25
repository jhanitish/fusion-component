const cors = require('cors');
var express = require('express'),
app = express(),
port = process.argv[2] || 9005;
//port = process.argv[2] || 80;

app.use(express.static(__dirname + '/'));
app.use(cors);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:9876");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('*', function(req, res, next){
res.sendFile(__dirname + '/App.html');
});

app.listen(port, function () {
console.log('Example app listening on port ' + port + '!');
});