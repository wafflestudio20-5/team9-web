import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useMemo,
    useState,
} from 'react';

interface DateContextData {
    year: number;
    month: number;
    date: number;
    day: number;
    setYear: Dispatch<SetStateAction<number>>;
    setMonth: Dispatch<SetStateAction<number>>;
    setDate: Dispatch<SetStateAction<number>>;
    setDay: Dispatch<SetStateAction<number>>;
}

const DateContext = createContext<DateContextData>({
    year: 0,
    month: 0,
    date: 0,
    day: 0,
    setYear() {
        throw new Error('DateContext not provided');
    },
    setMonth() {
        throw new Error('DateContext not provided');
    },
    setDate() {
        throw new Error('DateContext not provided');
    },
    setDay() {
        throw new Error('DateContext not provided');
    },
});

export const useDateContext = () => useContext(DateContext);

function DateProvider({ children }: PropsWithChildren) {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [date, setDate] = useState(now.getDate());
    const [day, setDay] = useState(now.getDay());

    const value = useMemo(
        () => ({
            year,
            month,
            date,
            day,
            setYear,
            setMonth,
            setDate,
            setDay,
        }),
        [year, month, date, day],
    );

    return (
        <DateContext.Provider value={value}>{children}</DateContext.Provider>
    );
}

export default DateProvider;
