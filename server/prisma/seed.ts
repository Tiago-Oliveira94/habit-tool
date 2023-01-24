import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

const firstHabitId = '5376c0a6-da7f-44ab-be55-320a51734e9e'
const firstHabitCreationDate = new Date('2023-01-23T13:00:00.000')

const secondHabitId = '0361cf6d-78c8-45df-817b-7e2e49ceecb4'
const secondCreationDate = new Date('2023-01-24T13:00:00.000')

const thirdHabitId = 'cfa55460-1851-4eb5-a158-0db7cb6a98d4'
const thirdCreationDate = new Date('2023-01-25T13:00:00.000')

async function run() {
    await prisma.habit.deleteMany()
    await prisma.day.deleteMany()

    await Promise.all(
        [
            prisma.habit.create({
                data: {
                    id: firstHabitId,
                    title: 'Drink 2L of water',
                    created_at: firstHabitCreationDate,
                    weekDays: {
                        create: [
                            { week_day: 1 },
                            { week_day: 2 },
                            { week_day: 3 }
                        ]
                    }
                }
            }),
            prisma.habit.create({
                data: {
                    id: secondHabitId,
                    title: 'Do some exercise',
                    created_at: secondCreationDate,
                    weekDays: {
                        create: [
                            { week_day: 3 },
                            { week_day: 4 },
                            { week_day: 5 }
                        ]
                    }
                }
            }),
            prisma.habit.create({
                data: {
                    id: thirdHabitId,
                    title: 'Sleep at least 7 hours per night',
                    created_at: thirdCreationDate,
                    weekDays: {
                        create: [
                            { week_day: 1 },
                            { week_day: 2 },
                            { week_day: 3 },
                            { week_day: 4 },
                            { week_day: 5 }
                        ]
                    }
                }
            })

        ])

    await Promise.all(
        [
            //monday with 1 habit complete/available
            prisma.day.create({
                data: {
                    date: new Date('2023-01-23T13:00:00.000z'),
                    dayHabits: {
                        create: {
                            habit_id: firstHabitId
                        }
                    }
                }
            }),

            //tuesday with 1 habit complete/available
            prisma.day.create({
                data: {
                    date: new Date('2023-01-24T13:00:00.000z'),
                    dayHabits: {
                        create: {
                            habit_id: firstHabitId
                        }
                    }
                }
            }),

            //wednesday with 2 habits complete/available
            prisma.day.create({
                data: {
                    date: new Date('2023-01-25T13:00:00.000z'),
                    dayHabits: {
                        create: [
                            { habit_id: firstHabitId },
                            { habit_id: secondHabitId },
                        ]
                    }
                }
            })
        ]
    )


}

run()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })