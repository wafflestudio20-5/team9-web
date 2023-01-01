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
    } else if ([2, 4, 6, 8, 9, 11].includes(monthNow)) {
        return { year: yearNow, month: monthNow - 1, date: 31 };
    } else if ([5, 7, 10, 12].includes(monthNow)) {
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
        ([1, 3, 5, 7, 8, 10].includes(monthNow) && dateNow === 31) ||
        ([4, 6, 9, 11].includes(monthNow) && dateNow === 30) ||
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
    } else if ([2, 4, 6, 8, 9, 11].includes(monthNow)) {
        date += 31;
    } else if ([5, 7, 10, 12].includes(monthNow)) {
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
    } else if ([1, 3, 5, 7, 8, 10].includes(monthNow) && dateNow >= 25) {
        date -= 31;
    } else if ([4, 6, 8, 11].includes(monthNow) && dateNow >= 24) {
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

export const getTwoMonth = (
    yearNow: number,
    monthNow: number,
    isPrev: boolean,
) => {
    if (isPrev) {
        const { year, month } = getPrevMonth(yearNow, monthNow);
        if (year === yearNow) {
            return `${year}년 ${month}월 - ${monthNow}월`;
        } else {
            return `${year}년 ${month}월 - ${yearNow}년 ${monthNow}월`;
        }
    } else {
        const { year, month } = getNextMonth(yearNow, monthNow);
        if (year === yearNow) {
            return `${yearNow}년 ${monthNow}월 - ${month}월`;
        } else {
            return `${yearNow}년 ${monthNow}월 - ${year}년 ${month}월`;
        }
    }
};

export const getMonthInThisWeek = (
    yearNow: number,
    monthNow: number,
    dateNow: number,
    dayNow: number,
) => {
    if (dateNow - dayNow < 1) {
        return getTwoMonth(yearNow, monthNow, true);
    }

    const saturdayDate = dateNow + (6 - dayNow);
    if (
        ([1, 3, 5, 7, 8, 10, 12].includes(monthNow) && saturdayDate > 31) ||
        ([4, 6, 9, 11].includes(monthNow) && saturdayDate > 30) ||
        (monthNow === 2 && isLeapYear(yearNow) && saturdayDate > 29) ||
        (monthNow === 2 && !isLeapYear(yearNow) && saturdayDate > 28)
    ) {
        return getTwoMonth(yearNow, monthNow, false);
    }

    return `${yearNow}년 ${monthNow}월`;
};
