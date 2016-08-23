
var http = require('http');
var fs = require('fs');
var util = require('util');
var querystring = require('querystring');

var multipart = require('multipart');
var boundaryTag = "boundary";

http.createServer(function (request, response) {

    if (request.method == "OPTIONS") {
        response.writeHead(200, "OK", {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow_Origin": "*"
        });
        response.end();
    } else if (request.url = "/upload" && request.method.toUpperCase() == "POST") {
        var contentType = request.headers["content-type"];

        if (contentType.indexOf("multipart/form-data") > -1) {

            request.setEncoding('binary');//设置编码格式为二进制
            var body = '';
            var fileName = '';

            var boundaryIndex = contentType.indexOf(boundaryTag) + boundary.length + 2;
            var boundary = contentType.substring(boundaryIndex);

            request.on('data', function (chunk) {
                body += chunk;
            });

            request.on('end',function() {

                var file = querystring.parse(body, '\r\n', ':');


            });

        }

    }

}).listen(8080);