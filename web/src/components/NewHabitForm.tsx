import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from "phosphor-react";
import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';

const availableWeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function NewHabitForm() {
    const [title, setTitle] = useState('')
    const [weekDays, setWeekDays] = useState<number[]>([])

    async function createNewHabit(event: FormEvent) {
        event.preventDefault()

        if (!title || weekDays.length === 0) {
            return
        }

        await api.post('habit', {
            title,
            weekDays
        })
        setTitle('')
        setWeekDays([])
        alert('Habit Created!')
    }

    function handleToggleWeekDays(weekDay: number) {
        if (weekDays.includes(weekDay)) {
            const weekDaysWithRemovedOne = weekDays.filter(day => day !== weekDay)
            setWeekDays(weekDaysWithRemovedOne)
        }
        else {
            const weekDaysWithAddedOne = [...weekDays, weekDay]
            setWeekDays(weekDaysWithAddedOne)
        }
    }

    return (
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
            <label htmlFor="title" className="font-semibold leading-tight">
                What's your commitment?
            </label>

            <input
                type="text"
                id="title"
                placeholder="ex.: study, sleep, go to gym..."
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
                autoFocus
                value={title}
                onChange={event => setTitle(event.target.value)}
            />

            <label htmlFor="" className="font-semibold leading-tight mt-4">
                What's your frequency?
            </label>

            <div className="flex flex-col gap-2 mt-3">
                {availableWeekDays.map((weekDay, index) => {
                    return (
                        <Checkbox.Root
                            key={weekDay}
                            className="flex items-center gap-3 group"
                            checked={weekDays.includes(index)}
                            onCheckedChange={() => handleToggleWeekDays(index)}
                        >

                            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-violet-600 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900">
                                <Checkbox.Indicator>
                                    <Check
                                        size={20}
                                        className="text-white"
                                    />
                                </Checkbox.Indicator>
                            </div>

                            <span className="text-white leading-tight">
                                {weekDay}
                            </span>
                        </Checkbox.Root>
                    )
                })}

            </div>

            <button type="submit" className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-violet-600 hover:bg-violet-500 transition-colors">
                <Check size={20} weight="bold" />
                Confirm
            </button>
        </form>
    )
}