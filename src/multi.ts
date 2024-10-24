import cluster from 'cluster'
import { config } from 'dotenv'
import { createServer } from 'http'
import { requestHandler } from './index'
import os from 'os'
config()
const PORT = parseInt(process.env.PORT!)
if (!PORT) {
    console.error('ERROR: Missing PORT environment variable.')
    process.exit(1)
}
const workers = os.cpus().length

if (cluster.isPrimary) {
    console.log(`Master process ${process.pid} is running`)

    for (let i = 0; i < workers; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker process ${worker.process.pid} died. Restarting...`)
        cluster.fork()
    })
    import('./balancer')
} else {
    const workerId = cluster.worker?.id

    if (workerId !== undefined) {
        const app = createServer(requestHandler)

        const server = app.listen(PORT + workerId, () => {
            console.log(
                `Worker process ${process.pid} is listening on port ${PORT + workerId}`
            )
        })
    }
}
