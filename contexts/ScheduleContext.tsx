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
    scheduleIds: { id: number }[];
    setScheduleIds: Dispatch<SetStateAction<{ id: number }[]>>;
    isSelectMode: boolean;
    setIsSelectMode: Dispatch<SetStateAction<boolean>>;
}

const ScheduleContext = createContext<ScheduleContextData>({
    scheduleIds: [],
    setScheduleIds() {
        throw new Error('ScheduleContext not provided');
    },
    isSelectMode: false,
    setIsSelectMode() {
        throw new Error('ScheduleContext not provided');
    },
});

export const useScheduleContext = () => useContext(ScheduleContext);

export default function ScheduleProvider({ children }: PropsWithChildren) {
    const [scheduleIds, setScheduleIds] = useState<{ id: number }[]>([]);
    const [isSelectMode, setIsSelectMode] = useState<boolean>(false);

    const value = useMemo(
        () => ({
            scheduleIds,
            setScheduleIds,
            isSelectMode,
            setIsSelectMode,
        }),
        [scheduleIds, isSelectMode],
    );

    return (
        <ScheduleContext.Provider value={value}>
            {children}
        </ScheduleContext.Provider>
    );
}
