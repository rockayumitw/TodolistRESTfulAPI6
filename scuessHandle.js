function scuessHandle(res, code, todos, message = '', headers) {
    res.writeHead(200, headers);
        res.write(JSON.stringify({
            status: 'scuess',
            data: todos,
            message: '撈取成功'
        }))
        res.end()
}

module.exports = scuessHandle