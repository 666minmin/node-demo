
var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var path = request.url 
  var query = ''
  if(path.indexOf('?') >= 0){ query = path.substring(path.indexOf('?')) }
  var pathNoQuery = parsedUrl.pathname
  var queryObject = parsedUrl.query
  var method = request.method
  console.log(path);
  console.log(parsedUrl);
  if(path=="/"){
    var string=fs.readFileSync("./index.html",'utf8')
    var amount=fs.readFileSync('./db','utf8')
    string=string.replace('&&&amount&&&',amount)
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.write(string)
    response.end()

  }else if(path=="/style.css"){
    response.setHeader('Content-Type', 'text/css; charset=utf-8')
    response.write('body{background-color: #ddd;}h1{color: red;}')
    response.end()

  }else if(path=="/main.js"){
    response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
    response.write('alert("这是JS执行的")')
    response.end()

  }else if(path=='/pay' && method.toUpperCase()==='POST'){
    response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
    var amount=fs.readFileSync('./db','utf8')
    var newAmount=amount-1;
    if(Math.random()>0.5){
      fs.writeFileSync("./db",newAmount)
      response.write('success')
    }else{
      response.write('fail')
    }
    response.end()

  }else if(path=='/payImg'){
    var amount=fs.readFileSync('./db','utf8')
    var newAmount=amount-1;
    if(Math.random()>0.5){
      fs.writeFileSync("./db",newAmount)
      response.setHeader('Content-Type', 'images/png')
      response.statusCode=200
      response.write(fs.readFileSync('./timg.jpeg'))
    }else{
      response.statusCode=400
      response.write('fail')
    }
    response.end()

  }else if(parsedUrl.pathname=='/payScript'){
    var amount=fs.readFileSync('./db','utf8')
    var newAmount=amount-1;  
    fs.writeFileSync("./db",newAmount)
    response.setHeader('Content-Type', 'application/javascript')
    response.statusCode=200
    response.write(parsedUrl.query.callback
      +".call(undefined,{'success':true,'left':"+newAmount+"})");
    response.end()

  }else if(path==='/xxx'){
    response.statusCode=200
    response.setHeader('Content-type','text/xml;charset=utf-8')
    response.write('<?xml version="1.0" encoding="ISO-8859-1"?>'
                  +'<note>'
                  +'<to>George</to>'
                  +'<from>John</from>'
                  +'<heading>Reminder</heading>'
                  +"<body>Don't forget the meeting!</body>"
                  +'</note>')
    response.end()

  }else if(path==='/yyy'){
    response.statusCode=200
    response.setHeader('Content-type','text/xml;charset=utf-8')
   // response.setHeader('Access-Control-Allow-Origin','http://rose.com:8080')
    response.write('{"employees": [{ "firstName":"Bill" , "lastName":"Gates" },{ "firstName":"George" , "lastName":"Bush" },{ "firstName":"Thomas" , "lastName":"Carter" }]}'
    )
    response.end()

  }else{
    response.statusCode = 404
    response.end()
  }
   
})

server.listen(port)