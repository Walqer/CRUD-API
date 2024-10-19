import http from 'http'
import { getUsers } from './user'
const PORT = process.env.PORT || 3000

const requestHandler = (
    req: http.IncomingMessage,
    res: http.ServerResponse
) => {
    res.setHeader('Content-Type', 'application/json')
    const { method, url } = req
    console.log(`Request received: ${method} ${url}`)
    console.log('url', url)
    if (method === 'GET' && url === '/users') {
        const users = getUsers()
        res.end(JSON.stringify(users))
    }

    res.end(JSON.stringify('Hi'))
}

const server = http.createServer(requestHandler)

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
