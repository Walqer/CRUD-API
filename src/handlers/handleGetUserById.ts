import { ServerResponse } from 'http'
import { getUserById, InvalidUserIdError, UserNotFoundError } from '../user'
import { sendErrorResponse } from '../helpers/sendErrorResponse'

export const handleGetUserById = (id: string, res: ServerResponse) => {
    try {
        const user = getUserById(id)
        res.end(JSON.stringify(user))
    } catch (err) {
        if (err instanceof InvalidUserIdError) {
            sendErrorResponse(res, 400, err.message)
        } else if (err instanceof UserNotFoundError) {
            sendErrorResponse(res, 404, err.message)
        } else {
            sendErrorResponse(res, 500, 'An unexpected error occurred.')
        }
    }
}
