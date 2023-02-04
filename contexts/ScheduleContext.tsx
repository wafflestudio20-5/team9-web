import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
} from 'react';

import { useModal, MODAL_NAMES } from './ModalContext';

import { FullSchedule } from '@customTypes/ScheduleTypes';
import useLocalStorage from '@hooks/useLocalStorage';

interface ScheduleContextData {
    schedules: FullSchedule[] | undefined;
    setSchedules: Dispatch<SetStateAction<FullSchedule[] | undefined>>;
    isSelectMode: boolean | undefined;
    setIsSelectMode: Dispatch<SetStateAction<boolean | undefined>>;
    getOnClickFunction: (eventData: FullSchedule) => () => void;
    getEventItemStyleProp: (eventData: FullSchedule) => React.CSSProperties;
    getScheduleEventItemStyleProp: (
        eventData: FullSchedule,
    ) => React.CSSProperties;
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
    getEventItemStyleProp() {
        throw new Error('ScheduleContext not provided');
    },
    getScheduleEventItemStyleProp() {
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

    useEffect(() => {
        if (schedules === undefined) {
            setIsSelectMode(false);
        } else if (schedules) {
            setIsSelectMode(true);
        } // isSelected is not affected by a empty list of schedules
    }, [schedules]);
    const getOnClickFunction = (eventData: FullSchedule) => {
        if (isSelectMode) {
            return () => {
                if (
                    schedules
                        ?.map(event => {
                            return event.id;
                        })
                        .includes(eventData.id)
                ) {
                    setSchedules(
                        schedules.filter(v => {
                            return v.id !== eventData.id;
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
    const getEventItemStyleProp = (eventData: FullSchedule) => {
        if (
            schedules
                ?.map(event => {
                    return event.id;
                })
                .includes(eventData.id)
        ) {
            return { filter: 'brightness(2.0)', fontWeight: '700' };
        } else if (isSelectMode) {
            return { fontWeight: '100', filter: 'brightness(0.5)' };
        } else {
            return {};
        }
    };

    const getScheduleEventItemStyleProp = (eventData: FullSchedule) => {
        if (
            schedules
                ?.map(event => {
                    return event.id;
                })
                .includes(eventData.id)
        ) {
            return {
                border: '2px solid var(--structure)',
                boxShadow: '4px 0px 4px var(--grid-shadow)',
                fontWeight: '700',
            };
        } else if (isSelectMode) {
            return { color: 'var(--text-datesSecondary)', fontWeight: '100' };
        } else {
            return {};
        }
    };

    const value = useMemo(
        () => ({
            schedules,
            setSchedules,
            isSelectMode,
            setIsSelectMode,
            getOnClickFunction,
            getEventItemStyleProp,
            getScheduleEventItemStyleProp,
        }),
        [schedules, isSelectMode],
    );

    return (
        <ScheduleContext.Provider value={value}>
            {children}
        </ScheduleContext.Provider>
    );
}
