import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'
import { ProgressBar } from './ProgressBar'
import dayjs from 'dayjs'
import { HabitsList } from './HabitsList'
import { useState } from 'react'

// interface HabitProps {
//     completed: number
// }

interface HabitDayProps {
    date: Date
    defaultCompleted?: number
    amount?: number
}

export function HabitDay({ defaultCompleted = 0, amount = 0, date }: HabitDayProps) {
    const [completed, setCompleted] = useState(defaultCompleted)
    const completedPorcentage = amount > 0 ? Math.round((completed / amount) * 100) : 0
    const dayAndMouth = dayjs(date).format('MM/DD')
    const dayOfWeek = dayjs(date).format('dddd')

    function handleCompletedChanged(completed: number) {
        setCompleted(completed)
    }

    return (
        <Popover.Root>
            <Popover.Trigger className={clsx('w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background', {
                'bg-zinc-900 border-zinc-800': completedPorcentage === 0,
                'bg-violet-900 border-violet-700': completedPorcentage > 0 && completedPorcentage <= 20,
                'bg-violet-800 border-violet-600': completedPorcentage >= 20 && completedPorcentage < 40,
                'bg-violet-700 border-violet-500': completedPorcentage >= 40 && completedPorcentage < 60,
                'bg-violet-600 border-violet-500': completedPorcentage >= 60 && completedPorcentage < 80,
                'bg-violet-500 border-violet-400': completedPorcentage >= 80
            })} />
            <Popover.Portal>
                <Popover.Content className="min-w-[320px] p-6 rounded-2x-l bg-zinc-900 flex flex-col">
                    <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
                    <span className="mt-1 font-extrabold leading-tight text-3x1">{dayAndMouth}</span>

                    <ProgressBar progress={completedPorcentage} />
                    <HabitsList date={date} handleCompletedChanged={handleCompletedChanged} />

                    <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}