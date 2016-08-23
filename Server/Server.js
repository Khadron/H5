
var http = require('http');
var queryString = require('querystring');
var multipart = require('multipart');

function writeResponse(response, data) {

    var total = 0;
    for (d in data) {
        total += Number(data[d]);
    }
    response.writeHead(200, "OK", {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "http://localhost"
    });
    response.write('<html><head><title></title></head><body>');
    response.write('<p>' + total + ' items ordered</p></body></html>');
    response.end();
}

htt.createServer(function (request, response) {
    console.log("[200]" + request.method + " to " + request.url);
    if (request.method == "OPTIONS") {
        response.writeHead(200, "OK", {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Origin": "*"
        });
        response.end();
    } else if (request.url == '/form' && request.method == "POST") {
        var dataObj = new Object();
        var contentType = request.headers["content-type"];
        var fullBody = '';

        if (contentType) {
            if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
                request.on('data', function (chunk) { fullBody += chunk.toString() });
                request.on('end', function () {
                    var dBody = queryString.parse(fullBody);
                    dataObj.bananas = dBody["bananas"];
                    dataObj.apples = dBody["apples"];
                    dataObj.cherries = dBody["cherries"];

                    writeResponse(response, dataObj);
                });
            } else if (contentType.indexOf("application/json") > -1) {
                request.on("data", function (chunk) { fullBody += chunk.toString(); });
                request.on("end", function () {
                    dataObj = JSON.parse(fullBody);
                    writeResponse(response, dataObj);
                });
            } else if (contentType.indexOf("multipart/form-data") > -1) {
                var partName;
                var partType;
                var parser = new multipart.parser();
                parser.boundary = "--" + request.headers["content-type"].substring(30);
                parser.onpartbegin = function (part) {
                    partName = part.name;
                    partType = part.contentType;
                    parser.ondata = function (data) {
                        if (partName != "file") {
                            dataObj[partName] = data;
                        }
                    }

                    request.on('data', function (chunk) { parser.write(chunk) });
                    request.on('end', function () { writeResponse(response, dataObj) });
                }
            }

        }

    }

}).listen(8080);