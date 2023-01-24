import Fastify from 'fastify'
import cors from '@fastify/cors'
import { routes } from './routes'

const app = Fastify()
app.register(cors)
app.register(routes)

const port = 3333

app.listen({
    port: port
}).then(() => { console.log(`Server is running on port ${port}!`) })