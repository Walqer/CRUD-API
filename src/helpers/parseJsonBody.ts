import { IncomingMessage } from 'http'
export const parseJsonBody = (req: IncomingMessage) => {
    return new Promise((resolve, reject) => {
        let body = ''
        req.on('data', (chunk: Buffer) => {
            body += chunk.toString()
        })
        req.on('end', () => {
            try {
                resolve(JSON.parse(body))
            } catch (error) {
                reject(new SyntaxError('Invalid request body format.'))
            }
        })
    })
}
