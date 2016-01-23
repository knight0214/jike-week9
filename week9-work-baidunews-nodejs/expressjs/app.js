var express = require('express');
var app = express();
app.use(express.static('public'));

app.listen(3900, function() {
    var host = '127.0.0.1';
    var port = '3900';

    console.log('Example app listening at http://%s:%s', host, port);
});
