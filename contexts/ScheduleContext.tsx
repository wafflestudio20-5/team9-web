import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useMemo,
    useState,
} from 'react';

interface ScheduleContextData {
    schedules: { id: number }[];
    setSchedules: Dispatch<SetStateAction<{ id: number }[]>>;
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
    const [schedules, setSchedules] = useState<{ id: number }[]>([]);
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
