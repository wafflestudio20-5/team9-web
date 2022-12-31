export const isLeapYear = (year: number) => {
    if (year % 4 === 0) {
        if (year % 400 !== 0 && year % 100 === 0) return false;
        return true;
    }
    return false;
};

export const getPrevDay = (
    yearNow: number,
    monthNow: number,
    dateNow: number,
) => {
    if (dateNow !== 1) {
        return { year: yearNow, month: monthNow, date: dateNow - 1 };
    } else if (monthNow === 1) {
        return { year: yearNow - 1, month: 12, date: 31 };
    } else if (monthNow in [2, 4, 6, 8, 9, 11]) {
        return { year: yearNow, month: monthNow - 1, date: 31 };
    } else if (monthNow in [5, 7, 10, 12]) {
        return { year: yearNow, month: monthNow - 1, date: 30 };
    } else if (isLeapYear(yearNow)) {
        return { year: yearNow, month: 2, date: 29 };
    } else {
        return { year: yearNow, month: 2, date: 28 };
    }
};

export const getNextDay = (
    yearNow: number,
    monthNow: number,
    dateNow: number,
) => {
    if (monthNow === 12 && dateNow === 31) {
        return { year: yearNow + 1, month: 1, date: 1 };
    } else if (
        (monthNow in [1, 3, 5, 7, 8, 10] && dateNow === 31) ||
        (monthNow in [4, 6, 9, 11] && dateNow === 30) ||
        (monthNow === 2 && dateNow === 29) ||
        (monthNow === 2 && dateNow === 28 && !isLeapYear(yearNow))
    ) {
        return { year: yearNow, month: monthNow + 1, date: 1 };
    } else {
        return { year: yearNow, month: monthNow, date: dateNow + 1 };
    }
};

export const getPrevWeek = (
    yearNow: number,
    monthNow: number,
    dateNow: number,
) => {
    let year = yearNow;
    let month = monthNow - 1;
    let date = dateNow - 7;
    if (dateNow >= 8) {
        month = monthNow;
    } else if (monthNow === 1) {
        year -= 1;
        month = 12;
        date += 31;
    } else if (monthNow in [2, 4, 6, 8, 9, 11]) {
        date += 31;
    } else if (monthNow in [5, 7, 10, 12]) {
        date += 30;
    } else if (isLeapYear(yearNow)) {
        date += 29;
    } else {
        date += 28;
    }
    return { year: year, month: month, date: date };
};

export const getNextWeek = (
    yearNow: number,
    monthNow: number,
    dateNow: number,
) => {
    let year = yearNow;
    let month = monthNow + 1;
    let date = dateNow + 7;
    if (monthNow === 12 && dateNow >= 25) {
        year += 1;
        month = 1;
        date -= 31;
    } else if (monthNow in [1, 3, 5, 7, 8, 10] && dateNow >= 25) {
        date -= 31;
    } else if (monthNow in [4, 6, 8, 11] && dateNow >= 24) {
        date -= 30;
    } else if (monthNow === 2 && isLeapYear(yearNow) && dateNow >= 23) {
        date -= 29;
    } else if (monthNow === 2 && !isLeapYear(yearNow) && dateNow >= 22) {
        date -= 28;
    } else {
        month = monthNow;
    }
    return { year: year, month: month, date: date };
};

export const getPrevMonth = (yearNow: number, monthNow: number) => {
    if (monthNow === 1) {
        return { year: yearNow - 1, month: 12, date: 1 };
    } else {
        return { year: yearNow, month: monthNow - 1, date: 1 };
    }
};

export const getNextMonth = (yearNow: number, monthNow: number) => {
    if (monthNow === 12) {
        return { year: yearNow + 1, month: 1, date: 1 };
    } else {
        return { year: yearNow, month: monthNow + 1, date: 1 };
    }
};
