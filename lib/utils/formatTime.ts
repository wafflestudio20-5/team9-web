export const formatTime = (hour: number, minute: number, is24Hour: boolean) => {
    if (is24Hour) {
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(
            2,
            '0',
        )}:00`;
    }

    let half;
    if (hour < 12) {
        if (hour === 0) hour = 12;
        half = '오전';
    } else {
        hour -= 12;
        half = '오후';
    }
    return `${half} ${hour}:${String(minute).padStart(2, '0')}`;
};
