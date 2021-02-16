var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function temHTML(title, list, body){
    return `
    <!doctype html>
    <html>
    <head>
    <title>${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">ITDIC</a></h1>
        ${list}
        <a href="/login">Login</a>
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
                var title = "ITDIC";
                var description = "ITDIC 홈페이지입니다.";
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
            });
        }
    }
    else if(pathname === '/login'){
        fs.readdir('./data', function(error, filelist){
            var title = "ITDIC";
            var description = "ITDIC 홈페이지입니다.";
            var list = temList(filelist);
            var template = temHTML(title, list, `<form action="http://localhost:1100/login_process" method="post">
            <p><input type="text" name="id" placeholder="id"></p>
            <p><input type="password" name="pw" placeholder="password"></p>
            <p><input type="submit"></p>
        </form>
        `);
            response.writeHead(200);
            response.end(template);
        });
    }
    else if(pathname === '/login_process'){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var pw = post.pw;
        response.writeHead(302, {Location: `/success`});
        response.end();
      });
    }
    else if(pathname === '/success'){
      response.writeHead(200);
      response.end("Hello");
    }
    else {
        response.writeHead(404);
        response.end('Not found!');
    }
});
app.listen(1100);