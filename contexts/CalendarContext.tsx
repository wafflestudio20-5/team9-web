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

interface CalendarContextData {
    calendarType: CalendarType;
    setCalendarType: Dispatch<SetStateAction<CalendarType>>;
    needUpdate: boolean;
    setNeedUpdate: Dispatch<SetStateAction<boolean>>;
}

const CalendarContext = createContext<CalendarContextData>({
    calendarType: CalendarType.index,
    setCalendarType() {
        throw new Error('CalendarTypeContext no provided');
    },
    needUpdate: false,
    setNeedUpdate() {
        throw new Error('CalendarTypeContext no provided');
    },
});

export const useCalendarContext = () => useContext(CalendarContext);

export default function CalendarProvider({ children }: PropsWithChildren) {
    const [calendarType, setCalendarType] = useState<CalendarType>(
        CalendarType.index,
    );
    const [needUpdate, setNeedUpdate] = useState(false);

    const value = useMemo(
        () => ({
            calendarType,
            setCalendarType,
            needUpdate,
            setNeedUpdate,
        }),
        [calendarType, needUpdate],
    );

    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
}
