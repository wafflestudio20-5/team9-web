import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useState,
} from 'react';

type DateContextData = {
    year: number;
    month: number;
    date: number;
    setYear(yyyy: number): void;
    setMonth(mm: number): void;
    setDate(dd: number): void;
};

const DateContext = createContext<DateContextData>({
    year: 0,
    month: 0,
    date: 0,
    setYear() {
        throw new Error('DateContext not provided');
    },
    setMonth() {
        throw new Error('DateContext not provided');
    },
    setDate() {
        throw new Error('DateContext not provided');
    },
});

export const useDateContext = () => useContext(DateContext);

function DateProvider({ children }: PropsWithChildren) {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [date, setDate] = useState(now.getDate());

    return (
        <DateContext.Provider
            value={{ year, month, date, setYear, setMonth, setDate }}
        >
            {children}
        </DateContext.Provider>
    );
}

export default DateProvider;
