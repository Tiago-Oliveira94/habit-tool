import Fastify from 'fastify'
import cors from '@fastify/cors'
import { routes } from './routes'

const app = Fastify()
app.register(cors)
app.register(routes)

const port = 3333
const host = '192.168.100.121'

app.listen({
    port: port,
    host: host
}).then(() => { console.log(`Server is running on port ${host}:${port}!`) })