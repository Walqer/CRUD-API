import { config } from 'dotenv'
import { createServer, IncomingMessage, ServerResponse } from 'http'
import os from 'os'
import http from 'http'
config()
const PORT = parseInt(process.env.PORT!)
if (!PORT) {
    console.error('ERROR: Missing PORT environment variable.')
    process.exit(1)
}
const WORKER_COUNT = os.cpus().length - 1
let currentWorker = 0

const workerPorts = Array.from({ length: WORKER_COUNT }, (_, i) => PORT + i + 1)

const loadBalancer = createServer(
    (req: IncomingMessage, res: ServerResponse) => {
        const targetPort = workerPorts[currentWorker] // Выбор порта для текущего запроса

        currentWorker = (currentWorker + 1) % WORKER_COUNT

        const options = {
            hostname: 'localhost',
            port: targetPort,
            path: req.url,
            method: req.method,
            headers: req.headers,
        }

        const proxyReq = http.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode!, proxyRes.headers)
            proxyRes.pipe(res, { end: true })
        })

        req.pipe(proxyReq, { end: true })

        console.log(`Перенаправление запроса на порт ${targetPort}`)
    }
)

// Запуск балансировщика нагрузки
loadBalancer.listen(PORT, () => {
    console.log(`Балансировщик нагрузки запущен на http://localhost:${PORT}`)
})
