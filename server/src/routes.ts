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

    app.patch('/habits/:id/toggle', async (request) => {
        const toggleHabitParams = z.object({
            id: z.string().uuid()
        })

        const { id } = toggleHabitParams.parse(request.params)
        const today = dayjs().startOf('day').toDate()

        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        })

        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today
                }
            })
        }
        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        })

        if (dayHabit) {
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
        }
        else {
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            })
        }
    })

    app.get('/summary', async () => {
        const summary = await prisma.$queryRaw`
            SELECT
            D.id,
            D.date,
            (
                SELECT
                cast(count(*) as float)
                FROM day_habits
                WHERE day_habits.day_id = D.id
            ) as completed,
            (
                SELECT
                cast(count(*) as float)
                FROM habit_week_days HWD
                JOIN habits H
                ON H.id = HWD.habit_id
                WHERE HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
                AND H.created_at <= D.date
            ) as amount
            FROM days D
        `

        return summary
    })
}
