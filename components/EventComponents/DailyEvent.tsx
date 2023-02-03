import React from 'react';

import styles from './DailyEvent.module.scss';
import getEventColorClass from './getEventColorClass';

import { useModal, MODAL_NAMES } from '@contexts/ModalContext';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import { getTimeInMinutes } from '@utils/calculateDate';
import { formatEventTime, formatHour, formatTime } from '@utils/formatting';
import { useScheduleContext } from '@contexts/ScheduleContext';

export default function DailyEvent({
    textTop,
    event,
    layer,
}: {
    textTop: number;
    event: FullSchedule;
    layer: number;
}) {
    const { openModal } = useModal();
    const { getOnClickFunction, getEventItemFilterProp } = useScheduleContext();

    const heightPerMinute = 1320 / (24 * 60);
    const startTimeInMinutes = getTimeInMinutes(new Date(event.start_at));
    const endTimeInMinutes = getTimeInMinutes(new Date(event.end_at));
    const topPosition = startTimeInMinutes * heightPerMinute;
    const height = Math.max(
        (endTimeInMinutes - startTimeInMinutes) * heightPerMinute,
        20,
    );
    const timeText = () => {
        if (event.start_at === event.end_at) {
            const newDate = new Date(event.start_at);
            return newDate.getMinutes() === 0
                ? formatHour(newDate)
                : formatTime(newDate);
        }
        return formatEventTime(
            new Date(event.start_at),
            new Date(event.end_at),
        );
    };

    return (
        <div
            className={`${styles.event} ${getEventColorClass(
                event.created_by,
            )}`}
            style={{
                top: `${topPosition}px`,
                width: `${100 - layer * 12}%`,
                height: `${height}px`,
                zIndex: `${Number(layer) + 1}`,
                filter: `${getEventItemFilterProp(event)}`,
            }}
            data-layer={String(layer)}
            onClick={getOnClickFunction(event)}
        >
            <div
                className={`${styles.textHolder} ${
                    height < 30 ? styles.oneline : styles.twoline
                }`}
                style={{
                    paddingTop: `${
                        height < 30
                            ? 0
                            : Math.min(textTop + 8, Math.max(height - 38, 0))
                    }px`,
                }}
            >
                {height < 30 ? (
                    <div className={styles.onelineText}>{`${
                        event.title
                    }, ${timeText()}`}</div>
                ) : (
                    <>
                        <div className={styles.twolineTitle}>{event.title}</div>
                        <div className={styles.twolineTitle}>{timeText()}</div>
                    </>
                )}
            </div>
        </div>
    );
}
