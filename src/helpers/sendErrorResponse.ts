import { ServerResponse } from 'http'

type HttpStatusCode =
    | 100
    | 101
    | 200
    | 201
    | 202
    | 204
    | 300
    | 301
    | 302
    | 400
    | 401
    | 403
    | 404
    | 500
    | 501
    | 502
    | 503

export const sendErrorResponse = (
    res: ServerResponse,
    statusCode: HttpStatusCode,
    message: string
) => {
    res.statusCode = statusCode
    res.end(JSON.stringify({ message }))
}
