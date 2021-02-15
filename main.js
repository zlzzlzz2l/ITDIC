var http = require('http');
var fs = require('fs');
var url = require('url');

function temHTML(title, list, body){
    return `
    <!doctype html>
    <html>
    <head>
    <title>${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">ITAIRY</a></h1>
        ${list}
        ${body}
    </body>
    </html>`;
}

function temList(filelist){
    var list = `<ul>`;
    var i = 0;
    while (i < filelist.length){
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
    }
    list = list + `</ul>`;
    return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;
    if(pathname === '/'){
        if(queryData.id === undefined){
            fs.readdir('./data', function(error, filelist){
                var title = "ITARIY";
                var description = "ITARIY 홈페이지입니다.";
                var list = temList(filelist);
                var template = temHTML(title, list, `<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(template);
            });
        }
        else {
            fs.readdir('./data', function(error, filelist){
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                    var list = temList(filelist);
                    var template = temHTML(title, list, `<h2>${title}</h2>${description}`);
                    response.writeHead(200);
                    response.end(template);
                });
            })

        }
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(1100);