import { IncomingMessage, ServerResponse } from 'http'
import { createUser } from '../user'
import { sendErrorResponse } from '../helpers/sendErrorResponse'

export const handleCreateUser = (req: IncomingMessage, res: ServerResponse) => {
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
                sendErrorResponse(res, 400, 'Invalid request body format.')
            } else if (err instanceof Error) {
                sendErrorResponse(res, 400, err.message)
            } else {
                sendErrorResponse(res, 500, 'An unexpected error occurred.')
            }
        }
    })
}
