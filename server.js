const http = require('http');
const { v4: uuidv4 } = require("uuid");
const errorHandle = require("./errorHandle")
const todos = [];

const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS',
    'Content-Type': 'application/json'
};

const sendResponse = (response, status, data) => {
    response.writeHead(status, headers);
    if (data !== undefined) {
        response.write(JSON.stringify(data));
    };
    response.end();
}

const requestListener = (request, response) => {
    let body = '';

    request.on('data', chunk => {
        body += chunk;
    })
    
    if (request.url == '/todos' && request.method == "GET") {
        sendResponse(response, 200, {
            "status": "success",
            "data": todos,
        });
    } else if (request.url == '/todos' && request.method == "POST") {
        request.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                if (title !== undefined) {
                    const todo = {
                        "title": title,
                        "id": uuidv4()
                    }
                    todos.push(todo);
                    sendResponse(response, 200, {
                        "status": "success",
                        "data": todos,
                    });
                } else {
                    errorHandle(response);
                }
                
            } catch(error) {
                errorHandle(response);
            }
            
        })
    } else if (request.url == '/todos' && request.method == "DELETE") {
        todos.length = 0;
        sendResponse(response, 200, {
            "status": "success",
            "data": todos,
            "delete": "yes"
        });
    } else if (request.url.startsWith("/todos/") && request.method == "DELETE") {
        const id = request.url.split('/').pop();
        const index = todos.findIndex(element => element.id === id);
        if (index !== -1) {
            todos.splice(index, 1);
            sendResponse(response, 200, {
                "status": "success",
                "data": todos,
            });
        } else {
            errorHandle(response);
        }
    } else if (request.url.startsWith("/todos/") && request.method == "PATCH") {
        request.on('end', () => {
            try {
                const todo = JSON.parse(body).title;
                const id = request.url.split('/').pop();
                const index = todos.findIndex(element => element.id === id);
                if (todo !== undefined && index !== -1) {
                    todos[index].title = todo;
                    sendResponse(response, 200, {
                        "status": "success",
                        "data": todos,
                    });
                } else {
                    errorHandle(response);
                }
            } catch {
                errorHandle(response);
            }
        })
    } else if (request.method == "OPTIONS"){
        sendResponse(response, 200);
    } else {
        sendResponse(response, 200, {
            "status": "false",
            "message": "無此網站喔！",
        });
    }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8080);