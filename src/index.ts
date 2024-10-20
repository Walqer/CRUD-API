import { createServer, IncomingMessage, ServerResponse } from 'http'
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

export const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json')
    const { method, url } = req
    switch (method) {
        case 'GET':
            if (url === '/') {
                res.statusCode = 200
                res.end(JSON.stringify({ message: 'Hello world' }))
            } else if (url === '/api/users') {
                const users = getUsers()
                res.end(JSON.stringify(users))
            } else if (url?.startsWith('/api/users/')) {
                const id = url.split('/').pop()!
                console.log(id)
                handleGetUserById(id, res)
            } else {
                res.statusCode = 404
                res.end(JSON.stringify({ message: 'Not Found' }))
            }
            break

        case 'POST':
            if (url === '/api/users') {
                handleCreateUser(req, res)
            } else {
                res.statusCode = 404
                res.end(JSON.stringify({ message: 'Not Found' }))
            }
            break

        case 'PUT':
            if (url?.startsWith('/api/users/')) {
                const id = url.split('/').pop()!
                handleUpdateUser(id, req, res)
            } else {
                res.statusCode = 404
                res.end(JSON.stringify({ message: 'Not Found' }))
            }
            break

        case 'DELETE':
            if (url?.startsWith('/api/users/')) {
                const id = url.split('/').pop()!
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

export const server = createServer(requestHandler)
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
