interface ProgressBarProps {
    progress: number
}

export function ProgressBar(props: ProgressBarProps) {
    const progressStyles = {
        width: `${props.progress}%`
    }
    return (
        <div>
            <div
                role="ProgressBar"
                aria-label="Progress of Habits completed in this day"
                aria-valuenow={props.progress}
                className="h-3 rounded-xl bg-violet-600"
                style={progressStyles}
            />
        </div>
    )
}