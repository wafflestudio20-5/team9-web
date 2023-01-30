import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useMemo,
    useState,
} from 'react';

import { FullSchedule } from '@customTypes/ScheduleTypes';

interface ScheduleContextData {
    schedules: FullSchedule[];
    setSchedules: Dispatch<SetStateAction<FullSchedule[]>>;
    isSelectMode: boolean;
    setIsSelectMode: Dispatch<SetStateAction<boolean>>;
}

const ScheduleContext = createContext<ScheduleContextData>({
    schedules: [],
    setSchedules() {
        throw new Error('ScheduleContext not provided');
    },
    isSelectMode: false,
    setIsSelectMode() {
        throw new Error('ScheduleContext not provided');
    },
});

export const useScheduleContext = () => useContext(ScheduleContext);

export default function ScheduleProvider({ children }: PropsWithChildren) {
    const [schedules, setSchedules] = useState<FullSchedule[]>([]);
    const [isSelectMode, setIsSelectMode] = useState<boolean>(false);

    const value = useMemo(
        () => ({
            schedules,
            setSchedules,
            isSelectMode,
            setIsSelectMode,
        }),
        [schedules, isSelectMode],
    );

    return (
        <ScheduleContext.Provider value={value}>
            {children}
        </ScheduleContext.Provider>
    );
}
