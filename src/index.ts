import http from 'http'

const PORT = process.env.PORT || 3000

const requestHandler = (
    req: http.IncomingMessage,
    res: http.ServerResponse
) => {
    res.setHeader('Content-Type', 'application/json')

    const response = {
        message: 'Hello, World!',
        timestamp: new Date().toISOString(),
    }

    res.end(JSON.stringify(response))
}

const server = http.createServer(requestHandler)

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
