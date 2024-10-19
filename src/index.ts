import http from 'http'
import {
    createUser,
    deleteUser,
    getUserById,
    getUsers,
    InvalidUserIdError,
    updateUser,
    UserNotFoundError,
} from './user'
import { config } from 'dotenv'
config()
const PORT = process.env.PORT

const requestHandler = (
    req: http.IncomingMessage,
    res: http.ServerResponse
) => {
    res.setHeader('Content-Type', 'application/json')
    const { method, url } = req

    if (method === 'GET' && url === '/') {
        res.statusCode = 200
        res.end(JSON.stringify({ message: 'Hello world' }))
        return
    }

    if (method === 'GET' && url === '/users') {
        const users = getUsers()
        res.end(JSON.stringify(users))
        return
    }
    if (method === 'GET' && url?.startsWith('/users/')) {
        const id = url.split('/')[2]

        try {
            const user = getUserById(id)
            res.end(JSON.stringify(user))
        } catch (err) {
            if (err instanceof InvalidUserIdError) {
                res.statusCode = 400
                res.end(JSON.stringify({ message: err.message }))
            } else if (err instanceof UserNotFoundError) {
                res.statusCode = 404
                res.end(JSON.stringify({ message: err.message }))
            } else {
                res.statusCode = 500
                res.end(
                    JSON.stringify({ message: 'An unexpected error occurred.' })
                )
            }
        }
        return
    }
    if (method === 'POST' && url === '/users') {
        let body = ''
        req.on('data', (chunk: Buffer) => {
            body += chunk.toString()
        })
        req.on('end', () => {
            try {
                const data = JSON.parse(body)
                const newUser = createUser(data)
                res.statusCode = 201
                res.end(JSON.stringify(newUser))
            } catch (err) {
                if (err instanceof SyntaxError) {
                    res.statusCode = 400
                    res.end(
                        JSON.stringify({
                            message: 'Invalid request body format.',
                        })
                    )
                } else if (err instanceof Error) {
                    res.statusCode = 400
                    res.end(JSON.stringify({ message: err.message }))
                } else {
                    res.statusCode = 500
                    res.end(
                        JSON.stringify({
                            message: 'An unexpected error occurred.',
                        })
                    )
                }
            }
        })
        return
    }
    if (method === 'PUT' && url?.startsWith('/users/')) {
        const id = url.split('/')[2]
        let body = ''
        req.on('data', (chunk: Buffer) => {
            body += chunk.toString()
        })
        req.on('end', () => {
            try {
                const data = JSON.parse(body)
                const updatedUser = updateUser(id, data)
                res.end(JSON.stringify(updatedUser))
            } catch (err) {
                if (err instanceof SyntaxError) {
                    res.statusCode = 400
                    res.end(
                        JSON.stringify({
                            message: 'Invalid request body format.',
                        })
                    )
                } else if (err instanceof InvalidUserIdError) {
                    res.statusCode = 400
                    res.end(JSON.stringify({ message: err.message }))
                } else if (err instanceof UserNotFoundError) {
                    res.statusCode = 404
                    res.end(JSON.stringify({ message: err.message }))
                } else {
                    res.statusCode = 500
                    res.end(
                        JSON.stringify({
                            message: 'An unexpected error occurred.',
                        })
                    )
                }
            }
        })

        return
    }
    if (method === 'DELETE' && url?.startsWith('/users/')) {
        const id = url.split('/')[2]
        try {
            deleteUser(id)
            res.statusCode = 204
            res.end()
        } catch (err) {
            if (err instanceof InvalidUserIdError) {
                res.statusCode = 400
                res.end(JSON.stringify({ message: err.message }))
            } else if (err instanceof UserNotFoundError) {
                res.statusCode = 404
                res.end(JSON.stringify({ message: err.message }))
            } else {
                res.statusCode = 500
                res.end(
                    JSON.stringify({
                        message: 'An unexpected error occurred.',
                    })
                )
            }
        }
        return
    }

    res.statusCode = 404
    res.end(JSON.stringify({ message: 'Not Found' }))
    return
}

const server = http.createServer(requestHandler)

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
