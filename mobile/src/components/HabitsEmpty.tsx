import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native";

export function HabitsEmpty() {
    const { navigate } = useNavigation()
    return (
        <Text
            className="text-zinc-400 text-base"
        >
            You don't have any habits here {'\n'}
            <Text
                className="text-violet-400 text-base underline"
                onPress={() => navigate('new')}
            >
                Create new habit
            </Text>
        </Text>
    )
}
