export const formatTime = (time: Date) => {
    let half;
    let hour = time.getHours();
    const minute = time.getMinutes();
    if (hour < 12) {
        if (hour === 0) hour = 12;
        half = '오전';
    } else {
        if (hour !== 12) hour -= 12;
        half = '오후';
    }
    return `${half} ${hour}:${String(minute).padStart(2, '0')}`;
};
