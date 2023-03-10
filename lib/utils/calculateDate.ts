export const isLeapYear = (year: number) => {
    if (year % 4 === 0) {
        if (year % 400 !== 0 && year % 100 === 0) return false;
        return true;
    }
    return false;
};

export const getLastDayInMonth = (year: number, month: number) => {
    // 0: Dec, 13: Jan
    if ([0, 1, 3, 5, 7, 8, 10, 12, 13].includes(month)) {
        return 31;
    } else if ([4, 6, 9, 11].includes(month)) {
        return 30;
    } else if (isLeapYear(year)) {
        return 29;
    } else {
        return 28;
    }
};

export const getPrevDay = (
    yearNow: number,
    monthNow: number,
    dateNow: number,
) => {
    if (monthNow === 1 && dateNow === 1) {
        return { year: yearNow - 1, month: 12, date: 31 };
    } else if (dateNow === 1) {
        return {
            year: yearNow,
            month: monthNow - 1,
            date: getLastDayInMonth(yearNow, monthNow - 1),
        };
    } else {
        return { year: yearNow, month: monthNow, date: dateNow - 1 };
    }
};

export const getNextDay = (
    yearNow: number,
    monthNow: number,
    dateNow: number,
) => {
    if (monthNow === 12 && dateNow === 31) {
        return { year: yearNow + 1, month: 1, date: 1 };
    } else if (dateNow === getLastDayInMonth(yearNow, monthNow)) {
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
    let date = dateNow - 7;
    if (date >= 1) return { year: yearNow, month: monthNow, date: date };
    date += getLastDayInMonth(yearNow, monthNow - 1);
    if (monthNow === 1) return { year: yearNow - 1, month: 12, date: date };
    return { year: yearNow, month: monthNow - 1, date: date };
};

export const getNextWeek = (
    yearNow: number,
    monthNow: number,
    dateNow: number,
) => {
    let date = dateNow + 7;
    if (date <= getLastDayInMonth(yearNow, monthNow)) {
        return { year: yearNow, month: monthNow, date: date };
    }
    date -= getLastDayInMonth(yearNow, monthNow);
    if (monthNow === 12) return { year: yearNow + 1, month: 1, date: date };
    return { year: yearNow, month: monthNow + 1, date: date };
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
        // prev month and this month
        const { year, month } = getPrevMonth(yearNow, monthNow);
        if (year === yearNow) {
            return `${year}??? ${month}??? - ${monthNow}???`;
        } else {
            return `${year}??? ${month}??? - ${yearNow}??? ${monthNow}???`;
        }
    } else {
        // this month and next month
        const { year, month } = getNextMonth(yearNow, monthNow);
        if (year === yearNow) {
            return `${yearNow}??? ${monthNow}??? - ${month}???`;
        } else {
            return `${yearNow}??? ${monthNow}??? - ${year}??? ${month}???`;
        }
    }
};

export const getMonthInThisWeek = (
    yearNow: number,
    monthNow: number,
    dateNow: number,
    dayNow: number,
) => {
    // two months in a week
    if (dateNow - dayNow < 1) return getTwoMonth(yearNow, monthNow, true);
    const saturdayDate = dateNow + (6 - dayNow);
    if (saturdayDate > getLastDayInMonth(yearNow, monthNow)) {
        return getTwoMonth(yearNow, monthNow, false);
    }
    // one month in a week
    return `${yearNow}??? ${monthNow}???`;
};

export const getCalendarDates = ({
    dateObj,
    count,
}: {
    dateObj: Date;
    count?: number;
}) => {
    const firstDay = (dateObj: Date) => {
        const temp = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
        return temp.getDay();
    };
    const calendarDates = Array.from(Array(count ? count : 42).keys()).map(
        item => {
            const temp = new Date(
                dateObj.getFullYear(),
                dateObj.getMonth(),
                dateObj.getDate(),
            );
            temp.setDate(item - firstDay(dateObj) + 1);
            return temp;
        },
    );
    if (count || calendarDates[35].getMonth() === dateObj.getMonth()) {
        // if count was provided, calendarDates is already fit to count -> return right away
        // even if count wasn't provided, if the first element of the last line (index 35)
        // still represents the month in concern, need to return the entireity of 42 elements
        return calendarDates;
    }
    // else: if count wasn't provided, and 35 elemetns in total were enough to express all dates
    // (=== index 35 does not represent the date in concern), return only up to the necessary 35 elements
    return calendarDates.slice(0, 35);
};

export function getTimeInMinutes(dateObj: Date) {
    return dateObj.getHours() * 60 + dateObj.getMinutes();
}
