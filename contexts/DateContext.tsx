import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useMemo,
    useState,
} from 'react';

export enum CalendarType {
    index = 'index',
    day = 'day',
    week = 'week',
    month = 'month',
    schedule = 'schedule',
}

interface DateContextData {
    yearNow: number;
    monthNow: number;
    dateNow: number;
    dayNow: number;
    calendarType: CalendarType;
    setYearNow: Dispatch<SetStateAction<number>>;
    setMonthNow: Dispatch<SetStateAction<number>>;
    setDateNow: Dispatch<SetStateAction<number>>;
    setDayNow: Dispatch<SetStateAction<number>>;
    setCalendarType: Dispatch<SetStateAction<CalendarType>>;
}

const DateContext = createContext<DateContextData>({
    yearNow: 0,
    monthNow: 0,
    dateNow: 0,
    dayNow: 0,
    calendarType: CalendarType.index,
    setYearNow() {
        throw new Error('DateContext not provided');
    },
    setMonthNow() {
        throw new Error('DateContext not provided');
    },
    setDateNow() {
        throw new Error('DateContext not provided');
    },
    setDayNow() {
        throw new Error('DateContext not provided');
    },
    setCalendarType() {
        throw new Error('DateContext not provided');
    },
});

export const useDateContext = () => useContext(DateContext);

export default function DateProvider({ children }: PropsWithChildren) {
    const now = new Date();
    const [yearNow, setYearNow] = useState(now.getFullYear());
    const [monthNow, setMonthNow] = useState(now.getMonth() + 1);
    const [dateNow, setDateNow] = useState(now.getDate());
    const [dayNow, setDayNow] = useState(now.getDay());
    const [calendarType, setCalendarType] = useState(CalendarType.index);

    const value = useMemo(
        () => ({
            yearNow,
            setYearNow,
            monthNow,
            setMonthNow,
            dateNow,
            setDateNow,
            dayNow,
            setDayNow,
            calendarType,
            setCalendarType,
        }),
        [yearNow, monthNow, dateNow, dayNow, calendarType],
    );

    return (
        <DateContext.Provider value={value}>{children}</DateContext.Provider>
    );
}
