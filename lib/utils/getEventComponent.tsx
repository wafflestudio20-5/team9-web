import React from 'react';

import { FullSchedule } from '@customTypes/ScheduleTypes';
import FillerEvent from '@components/EventComponents/FillerEvent';
import AcrossEvent from '@components/EventComponents/AcrossEvent';
import WithinEvent from '@components/EventComponents/WithinEvent';

interface getEventComponentOptions {
    eventHeight?: number;
    boxWidth?: number;
}

export default function getEventComponent({
    dateString,
    data,
    index,
    options,
}: {
    dateString: string;
    data: {
        type: 'across' | 'within' | 'filler';
        event: FullSchedule | null;
    };
    index: number;
    options?: getEventComponentOptions;
}) {
    const eventHeight = options?.eventHeight ? options?.eventHeight : 20;
    const boxWidth = options?.boxWidth ? options?.boxWidth : undefined;
    if (data === null) {
        return <FillerEvent key={index} eventHeight={eventHeight} />;
    }
    if (data === undefined) {
        return;
    }
    switch (data.type) {
        case 'across':
            return (
                <AcrossEvent
                    key={index}
                    layer={index}
                    eventData={data.event!}
                    dateString={dateString}
                    eventHeight={eventHeight}
                    boxWidth={boxWidth}
                />
            );
        case 'within':
            return (
                <WithinEvent
                    key={index}
                    layer={index}
                    eventData={data.event!}
                    eventHeight={eventHeight}
                />
            );
        case 'filler':
            return <FillerEvent key={index} eventHeight={eventHeight} />;
        default:
            throw new Error('invalid LayerData type');
    }
}
