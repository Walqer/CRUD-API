import http from 'http'
import { getUsers } from './user'
import { config } from 'dotenv'
import { handleGetUserById } from './handlers/handleGetUserById'
import { handleCreateUser } from './handlers/handleCreateUser'
import { handleDeleteUser } from './handlers/handleDeleteUser'
import { handleUpdateUser } from './handlers/handleUpdateUser'

config()
const PORT = process.env.PORT
if (!PORT) {
    console.error('ERROR: Missing PORT environment variable.')
    process.exit(1)
}

const requestHandler = (
    req: http.IncomingMessage,
    res: http.ServerResponse
) => {
    res.setHeader('Content-Type', 'application/json')
    const { method, url } = req
    switch (method) {
        case 'GET':
            if (url === '/') {
                res.statusCode = 200
                res.end(JSON.stringify({ message: 'Hello world' }))
            } else if (url === '/users') {
                const users = getUsers()
                res.end(JSON.stringify(users))
            } else if (url?.startsWith('/users/')) {
                const id = url.split('/')[2]
                handleGetUserById(id, res)
            } else {
                res.statusCode = 404
                res.end(JSON.stringify({ message: 'Not Found' }))
            }
            break

        case 'POST':
            if (url === '/users') {
                handleCreateUser(req, res)
            } else {
                res.statusCode = 404
                res.end(JSON.stringify({ message: 'Not Found' }))
            }
            break

        case 'PUT':
            if (url?.startsWith('/users/')) {
                const id = url.split('/')[2]
                handleUpdateUser(id, req, res)
            } else {
                res.statusCode = 404
                res.end(JSON.stringify({ message: 'Not Found' }))
            }
            break

        case 'DELETE':
            if (url?.startsWith('/users/')) {
                const id = url.split('/')[2]
                handleDeleteUser(id, res)
            } else {
                res.statusCode = 404
                res.end(JSON.stringify({ message: 'Not Found' }))
            }
            break

        default:
            res.statusCode = 405
            res.end(JSON.stringify({ message: 'Method Not Allowed' }))
            break
    }
}

const server = http.createServer(requestHandler)
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
