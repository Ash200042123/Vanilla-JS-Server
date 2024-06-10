
const { error } = require('console');
const fs = require('fs');
const http = require('http');
const path = require('path');
const port = 3000;




const httpServer = http.createServer((req,res)=>{
    if(req.url === '/projects'){
        readFile('pages/projects.html',res);
    }else if(req.url==='/about'){
        readFile('pages/about.html',res);
    }else if (req.method === 'POST' && req.url === '/project/new') {
        handleNewProject(req, res);
    } else if (req.url === '/project/new') {
        
        readFile('pages/new-project.html',res);
    }
    else{
        readFile('pages/home.html',res);
    }
});

const handleNewProject = (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        // Parse the URL-encoded data
        const projectData = {};
        const params = new URLSearchParams(body);
        for (const [key, value] of params) {
            projectData[key] = value;
        }

        
        fs.readFile('pages/projects.html', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading projects HTML:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            const newProjectHTML = `
                <div class="w-full lg:w-1/4 mb-8 flex flex-wrap p-8">
                    <div class="w-full lg:w-1/2">
                        <img src="${projectData.image}" alt="${projectData.title}" class="mb-6 rounded">
                    </div>
                    <div class="w-full lg:w-1/2 max-w-xl">
                        <h6 class="mb-2 font-semibold">${projectData.title}</h6>
                        <p class="mb-4 text-neutral-400">${projectData.description}</p>
                        <div>
                            ${projectData.technologies.split(',').map(tech => `<span class="mr-2 rounded bg-neutral-900 px-2 py-1 text-sm font-medium text-purple-900">${tech.trim()}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
            const updatedHTML = data.replace('</body>', `${newProjectHTML}</body>`);

            
            fs.writeFile('pages/projects.html', updatedHTML, 'utf8', (err) => {
                if (err) {
                    console.error('Error updating projects HTML:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }
                
                res.writeHead(302, { 'Location': '/projects' });
                res.end();
            });
        });
    });
};




const readFile = (file_path, res) => {
    if (fs.existsSync(file_path)) {
        const extension = path.extname(file_path);
        let content_type = 'text/plain';
        switch (extension) {
            case '.html':
                content_type = 'text/html';
                break;
            case '.css':
                content_type = 'text/css';
                break;
            // Add more cases for other file types if needed
        }
        fs.readFile(file_path, (error, data) => {
            if (error) {
                console.log(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': content_type });
                res.write(data);
                res.end();
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write(`<h1>The file does not exist!</h1>`);
        res.end();
    }
};


httpServer.listen(port, ()=>{
    console.log("Server is running on port "+port);
});