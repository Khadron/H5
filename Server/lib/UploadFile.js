
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

                request.setEncoding('binary'); //���ñ����ʽΪ������
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
                            console.log("�ļ���: " + fileName);
                        }
                    }


                    var entireData = body.toString();
                    contentType = file['Content-Type'].substring(1);

                    //��ȡ�ļ����������ݿ�ʼλ�ã���contentType�Ľ�β
                    var upperBoundary = entireData.indexOf(contentType) + contentType.length;
                    var shorterData = entireData.substring(upperBoundary);

                    // �滻��ʼλ�õĿո�
                    var binaryDataAlmost = shorterData.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

                    // ȥ������ĩβ�Ķ������ݣ���: "--"+ boundary + "--"
                    var binaryData = binaryDataAlmost.substring(0, binaryDataAlmost.indexOf('--' + boundary + '--'));

                    // �����ļ�
                    fs.writeFile(fileName, binaryData, 'utf-8', function (err) {
                        writeResponse(err);
                    });
                });

            }

        }

    }).listen(8081);

};
