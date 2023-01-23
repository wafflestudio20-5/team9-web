export const formatFullDate = (fullDate: Date, isTimeIncluded?: boolean) => {
    const year = String(fullDate.getFullYear()).padStart(4, '0');
    const month = String(fullDate.getMonth() + 1).padStart(2, '0');
    const date = String(fullDate.getDate()).padStart(2, '0');

    if (!isTimeIncluded) return `${year}-${month}-${date}`; // e.g. 2023-01-01

    const hour = String(fullDate.getHours()).padStart(2, '0');
    const minute = String(fullDate.getMinutes()).padStart(2, '0');
    const second = String(fullDate.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`; // e.g. 2023-01-09 02:04:00
};
