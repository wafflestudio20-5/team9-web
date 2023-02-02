export const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const formatDate = (fullDate: Date) => {
    const year = String(fullDate.getFullYear()).padStart(4, '0');
    const month = String(fullDate.getMonth() + 1).padStart(2, '0');
    const date = String(fullDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`; // e.g. 2023-01-01
};

export const formatDateWithTime = (fullDate: Date) => {
    const year = String(fullDate.getFullYear()).padStart(4, '0');
    const month = String(fullDate.getMonth() + 1).padStart(2, '0');
    const date = String(fullDate.getDate()).padStart(2, '0');

    const hour = String(fullDate.getHours()).padStart(2, '0');
    const minute = String(fullDate.getMinutes()).padStart(2, '0');
    const second = String(fullDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${date} ${hour}:${minute}:${second}`; // e.g. 2023-01-09 02:04:00
};

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

export const formatHour = (time: Date) => {
    let half;
    let hour = time.getHours();
    if (hour < 12) {
        if (hour === 0) hour = 12;
        half = '오전';
    } else {
        if (hour !== 12) hour -= 12;
        half = '오후';
    }
    return `${half} ${hour}시`;
};
