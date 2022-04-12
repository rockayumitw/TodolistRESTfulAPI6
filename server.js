const http = require('http');
const {v4: uuid4} = require('uuid');
const sucessHandle = require('./sucessHandle.js')
const errorHandle = require('./errorHandle.js')
const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    "Content-Type": "text/json"
}

let todos = [
    {
        id: '001',
        title: '12345'
    }
]

const requestListeners = (req, res) => {
    let body = ''
    req.on('data', chunk => body += chunk)

    if(req.url == '/todos' && req.method == 'GET') {
        sucessHandle(res, 200, '撈取成功', todos, headers) 
    } else if (req.url == '/todos' && req.method == 'DELETE') {
        try {
            todos.length = 0
            sucessHandle(res, 200, '刪除成功', todos, headers)
        } catch(e) {
            errorHandle(res, 400, '刪除失敗', headers)
        }
    } else if(req.url == '/todos' && req.method == 'POST') {
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title
                if(title != undefined) {
                    console.log(title)
                    const todo = {
                        title,
                        id: uuid4()
                    }
                    console.log(todo)
                    todos.push(todo)
                    sucessHandle(res, 200, '新增成功', todos, headers)
                } else {
                    errorHandle(res, 400, '新增失敗', headers)
                }
            } catch(e) {
                errorHandle(res, 400, '新增失敗', headers)
            }
        })
    } else if (req.url.startsWith('/todos') && req.method == 'PATCH') {
        req.on('end', () => {
            try{
                const title = JSON.parse(body).title
                const id = req.url.split('/').pop();
                const index = todos.findIndex(a => a.id == id)
                if(title != undefined && index != -1 ) {
                    todos[index].title = title
                    sucessHandle(res, 200, '編輯成功', todos, headers)
                } else {
                    errorHandle(res, 400, '編輯失敗', headers)
                }
            } catch(e) {
                errorHandle(res, 400, '編輯失敗', headers)
            }
        })
    } else if(req.url.startsWith('/todos') && req.method == 'DELETE') {
        req.on('end', () => {
            try{
                const id = req.url.split('/').pop();
                const index = todos.findIndex(a => a.id == id)
                if(index != -1 ) {
                    todos.splice(index, 1)
                    sucessHandle(res, 200, '刪除成功', todos, headers)
                } else {
                    errorHandle(res, 400, '刪除失敗', headers)
                }
            } catch(e) {
                errorHandle(res, 400, '刪除失敗', headers)
            }
        })
    } else if(req.method == 'OPTIONS') {
        res.writeHead(200, headers);
        res.end();
    } else {
        errorHandle(res, 404, '無此頁面', headers)
    }
}

http.createServer(requestListeners).listen(process.env.PORT || 3005)