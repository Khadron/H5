
var http = require('http');
var fs = require('fs');
var util = require('util');
var querystring = require('querystring');

exports.UploadFile = function () {

    var boundaryTag = "boundary";

    function writeResponse(response, data) {
        response.writeHead(200, "OK", {
            "Content-Type": "application/json",
        });

        response.end(data);
    }

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

                request.setEncoding('binary'); //设置编码格式为二进制
                var body = '';
                var fileName = '';

                var boundaryIndex = contentType.indexOf(boundaryTag) + boundaryTag.length + 2;
                var boundary = contentType.substring(boundaryIndex);

                var rs = fs.createReadStream();

                request.on('data', function (chunk) {
                    body += chunk;
                });

                request.on('end', function () {

                    var file = querystring.parse(body, '\r\n', ':');

                    var fileInfo = file['Content-Disposition'].split('; ');
                    for (value in fileInfo) {
                        if (fileInfo[value].indexOf("filename=") != -1) {
                            fileName = fileInfo[value].substring(10, fileInfo[value].length - 1);

                            if (fileName.indexOf('\\') != -1) {
                                fileName = fileName.substring(fileName.lastIndexOf('\\') + 1);
                            }
                            console.log("文件名: " + fileName);
                        }
                    }


                    var entireData = body.toString();
                    contentType = file['Content-Type'].substring(1);

                    //获取文件二进制数据开始位置，即contentType的结尾
                    var upperBoundary = entireData.indexOf(contentType) + contentType.length;
                    var shorterData = entireData.substring(upperBoundary);

                    // 替换开始位置的空格
                    var binaryDataAlmost = shorterData.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

                    // 去除数据末尾的额外数据，即: "--"+ boundary + "--"
                    var binaryData = binaryDataAlmost.substring(0, binaryDataAlmost.indexOf('--' + boundary + '--'));

                    // 保存文件
                    fs.writeFile(fileName, binaryData, 'utf-8', function (err) {
                        writeResponse(err);
                    });
                });

            }

        }

    }).listen(8081);

};
