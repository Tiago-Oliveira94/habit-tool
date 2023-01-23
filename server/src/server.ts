import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import cors from '@fastify/cors'

const app = Fastify()
app.register(cors)

const prisma = new PrismaClient()

app.get('/habits', () => {
    const habits = prisma.habit.findMany()
    return habits
 })
const port = 3333

app.listen({
    port: port
}).then(() => { console.log(`Server is running on port ${port}!`)})