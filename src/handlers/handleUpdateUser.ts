import { IncomingMessage, ServerResponse } from 'http'
import { InvalidUserIdError, updateUser, UserNotFoundError } from '../user'
import { sendErrorResponse } from '../helpers/sendErrorResponse'

export const handleUpdateUser = (
    id: string,
    req: IncomingMessage,
    res: ServerResponse
) => {
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
                sendErrorResponse(res, 400, 'Invalid request body format.')
            } else if (err instanceof InvalidUserIdError) {
                sendErrorResponse(res, 400, err.message)
            } else if (err instanceof UserNotFoundError) {
                sendErrorResponse(res, 404, err.message)
            } else {
                sendErrorResponse(res, 500, 'An unexpected error occurred.')
            }
        }
    })
}
