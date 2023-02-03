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
import useLocalStorage from '@hooks/useLocalStorage';
import { useModal, MODAL_NAMES } from './ModalContext';

interface ScheduleContextData {
    schedules: FullSchedule[] | undefined;
    setSchedules: Dispatch<SetStateAction<FullSchedule[] | undefined>>;
    isSelectMode: boolean | undefined;
    setIsSelectMode: Dispatch<SetStateAction<boolean | undefined>>;
    getOnClickFunction: (eventData: FullSchedule) => () => void;
    getEventItemFilterProp: (eventData: FullSchedule) => string;
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
    getOnClickFunction() {
        throw new Error('ScheduleContext not provided');
    },
    getEventItemFilterProp() {
        throw new Error('ScheduleContext not provided');
    },
});

export const useScheduleContext = () => useContext(ScheduleContext);

export default function ScheduleProvider({ children }: PropsWithChildren) {
    const { openModal } = useModal();
    const { stored: schedules, setStored: setSchedules } = useLocalStorage<
        FullSchedule[] | undefined
    >('ongoing_schedule_selections', undefined);
    const { stored: isSelectMode, setStored: setIsSelectMode } =
        useLocalStorage<boolean | undefined>(
            'is_schedule_selection_ongiong',
            undefined,
        );
    const getOnClickFunction = (eventData: FullSchedule) => {
        if (isSelectMode) {
            return () => {
                if (schedules?.includes(eventData)) {
                    setSchedules(
                        schedules.filter(v => {
                            return v !== eventData;
                        }),
                    );
                } else if (schedules) {
                    setSchedules([...schedules, eventData]);
                } else {
                    setSchedules([eventData]);
                }
            };
        }
        return () => {
            openModal(MODAL_NAMES.scheduleView, {
                schedule: eventData,
            });
        };
    };
    const getEventItemFilterProp = (eventData: FullSchedule) => {
        if (isSelectMode && schedules?.includes(eventData)) {
            return 'brightness(1.5)';
        } else if (isSelectMode) {
            return 'brightness(0.3)';
        } else {
            return 'none';
        }
    };

    const value = useMemo(
        () => ({
            schedules,
            setSchedules,
            isSelectMode,
            setIsSelectMode,
            getOnClickFunction,
            getEventItemFilterProp,
        }),
        [schedules, isSelectMode],
    );

    return (
        <ScheduleContext.Provider value={value}>
            {children}
        </ScheduleContext.Provider>
    );
}
