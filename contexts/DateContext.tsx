import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useMemo,
    useState,
    useCallback,
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
    validateDate(year: any, month: any, date: any): boolean;
    changeFullDate(year: number, month: number, date: number): void;
    changeToToday(): void;
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
    validateDate() {
        throw new Error('DateContext not provided');
    },
    changeFullDate() {
        throw new Error('DateContext not provided');
    },
    changeToToday() {
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

    const validateDate = useCallback((year: any, month: any, date: any) => {
        if (
            isNaN(Number(year)) ||
            isNaN(Number(month)) ||
            isNaN(Number(date))
        ) {
            return false;
        }
        // validate the scope of year, month, date
        return true;
    }, []);

    const changeFullDate = useCallback(
        (year: number, month: number, date: number) => {
            setYearNow(Number(year));
            setMonthNow(Number(month));
            setDateNow(Number(date));
            setDayNow(new Date(`${year}-${month}-${date}`).getDay());
        },
        [],
    );

    const changeToToday = useCallback(() => {
        setYearNow(now.getFullYear());
        setMonthNow(now.getMonth() + 1);
        setDateNow(now.getDate());
        setDayNow(now.getDay());
    }, [now]);

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
            validateDate,
            changeFullDate,
            changeToToday,
        }),
        [yearNow, monthNow, dateNow, dayNow],
    );

    return (
        <DateContext.Provider value={value}>{children}</DateContext.Provider>
    );
}
