import { ServerResponse } from 'http'
import { deleteUser, InvalidUserIdError, UserNotFoundError } from '../user'
import { sendErrorResponse } from '../helpers/sendErrorResponse'

export const handleDeleteUser = (id: string, res: ServerResponse) => {
    try {
        deleteUser(id)
        res.statusCode = 204
        res.end()
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
