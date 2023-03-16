import { Alert, ScrollView, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { useState, useEffect } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpty } from "../components/HabitsEmpty";
import { parse } from "react-native-svg";
import clsx from "clsx";

interface Params {
    date: string
}

interface DayInfoProps {
    completedHabits: string[]
    possibleHabits: {
        id: string
        title: string
    }[]
}

export function Habit() {
    const route = useRoute()
    const [loading, setLoading] = useState(true)
    const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
    const [completedHabits, setCompletedHabits] = useState<string[]>([])
    const { date } = route.params as Params

    const parsedDate = dayjs(date)
    const isDateInPast = parsedDate.endOf('day').isBefore(new Date())
    const dayOfWeek = parsedDate.format('dddd')
    const dayAndMouth = parsedDate.format('MM/DD')

    const habitsProgress = dayInfo?.possibleHabits.length ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length) : 0

    async function fetchHabits() {
        try {
            setLoading(true)
            const response = await api.get('/day', {
                params: {
                    date
                }
            })

            setDayInfo(response.data)
            setCompletedHabits(response.data.completedHabits)

        } catch (error) {
            console.log(error)
            Alert.alert('Ops...', 'It was not possible to get Habits data =(')
        } finally {
            setLoading(false)
        }
    }

    async function handleToggleHabit(habitId: string) {
        try {
            await api.patch(`/habits/${habitId}/toggle`)
            if (completedHabits.includes(habitId)) {
                setCompletedHabits(prevState =>
                    prevState.filter(habit => habit !== habitId)
                )
            } else {
                setCompletedHabits(prevState => [...prevState, habitId])
            }
        } catch (error) {
            console.log(error)
            return Alert.alert('Ops...', 'It was not possible to save habit data')
        }

    }

    useEffect(() => { fetchHabits() }, [])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMouth}
                </Text>

                <ProgressBar progress={habitsProgress} />

                <View className={clsx("mt-6 ", {
                    ["opacity-50"]: isDateInPast
                })}>
                    {
                        dayInfo?.possibleHabits ?
                            dayInfo.possibleHabits.map(habit => (
                                <Checkbox
                                    key={habit.id}
                                    title={habit.title}
                                    checked={completedHabits.includes(habit.id)}
                                    disabled={isDateInPast}
                                    onPress={() => handleToggleHabit(habit.id)}
                                />
                            )) : <HabitsEmpty />
                    }
                </View>

                {
                    isDateInPast && (
                        <Text className="text-white mt-10 text-center">
                            You cannot edit habits from days past
                        </Text>
                    )
                }
            </ScrollView>
        </View>
    )
}