import { FastifyInstance } from "fastify"
import { prisma } from "./lib/prisma"
import { z } from "zod"
import dayjs from "dayjs"


export async function routes(app: FastifyInstance) {
    app.get('/habits', () => {
        const habits = prisma.habit.findMany()
        return habits
    })

    app.get('/day', async (request) => {
        const getDayParam = z.object({
            date: z.coerce.date()
        })
        const { date } = getDayParam.parse(request.query)
        const weekDay = dayjs(date).get('day')

        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date
                },
                weekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where: {
                //set hours/minutes/seconds with 00:00:00.000z
                date: dayjs(date).startOf('day').toDate()
            },
            include: {
                dayHabits: true
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        })

        return { possibleHabits, completedHabits }
    })

    app.post('/habit', async (request) => {
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        })
        const { title, weekDays } = createHabitBody.parse(request.body)
        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data: {
                title: title,
                created_at: today,
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return { week_day: weekDay }
                    })
                }
            }
        })
    })
}
