
const { error } = require('console');
const fs = require('fs');
const http = require('http');
const port = 3000;

const httpServer = http.createServer((req,res)=>{
    if(req.url === '/projects'){
        readFile('pages/projects.html',res);
    }else if(req.url==='/about'){
        readFile('/pages/about.html',res);
    }
    else{
        readFile('pages/home.html',res);
    }
});


const readFile = (file_path, res)=>{
    if(fs.existsSync(file_path)){
        fs.readFile(file_path, (error,data)=>{
            if(error){
                console.log(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }else{
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                res.end();
            }
        });
    }else{
        res.writeHead(httpStatus.STATUS_CODES.NOT_FOUND,{"Content-Type": "text/html"});
        res.write(`<h1>The file does not exist!</h1>`);
        res.end();
    }
}


httpServer.listen(port, ()=>{
    console.log("Server is running on port "+port);
});