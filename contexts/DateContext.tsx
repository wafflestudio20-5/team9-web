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
    yearNow: number;
    monthNow: number;
    dateNow: number;
    dayNow: number;
    setYearNow: Dispatch<SetStateAction<number>>;
    setMonthNow: Dispatch<SetStateAction<number>>;
    setDateNow: Dispatch<SetStateAction<number>>;
    setDayNow: Dispatch<SetStateAction<number>>;
}

const DateContext = createContext<DateContextData>({
    yearNow: 0,
    monthNow: 0,
    dateNow: 0,
    dayNow: 0,
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
});

export const useDateContext = () => useContext(DateContext);

function DateProvider({ children }: PropsWithChildren) {
    const now = new Date();
    const [yearNow, setYearNow] = useState(now.getFullYear());
    const [monthNow, setMonthNow] = useState(now.getMonth() + 1);
    const [dateNow, setDateNow] = useState(now.getDate());
    const [dayNow, setDayNow] = useState(now.getDay());

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
        }),
        [yearNow, monthNow, dateNow, dayNow],
    );

    return (
        <DateContext.Provider value={value}>{children}</DateContext.Provider>
    );
}

export default DateProvider;
