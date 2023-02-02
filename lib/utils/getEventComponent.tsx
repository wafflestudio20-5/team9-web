import React from 'react';

import { FullSchedule, LayerData } from '@customTypes/ScheduleTypes';
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
    layer,
    options,
}: {
    dateString: string;
    data: LayerData[number];
    layer: number;
    options?: getEventComponentOptions;
}) {
    const eventHeight = options?.eventHeight ? options?.eventHeight : 20;
    // const boxWidth = options?.boxWidth ? options?.boxWidth : undefined;
    if (data === null) {
        return <FillerEvent key={layer} eventHeight={eventHeight} />;
    }
    if (data === undefined) {
        return;
    }
    switch (data.type) {
        case 'acrossLeft':
            return (
                <AcrossEvent
                    type="left"
                    key={layer}
                    layer={layer}
                    eventData={data.event!}
                    dateString={dateString}
                    eventHeight={eventHeight}
                />
            );
        case 'acrossLeftEnd':
            return (
                <AcrossEvent
                    type="leftEnd"
                    key={layer}
                    layer={layer}
                    eventData={data.event!}
                    dateString={dateString}
                    eventHeight={eventHeight}
                />
            );
        case 'acrossMiddle':
            return (
                <AcrossEvent
                    type="middle"
                    key={layer}
                    layer={layer}
                    eventData={data.event!}
                    dateString={dateString}
                    eventHeight={eventHeight}
                />
            );
        case 'acrossRight':
            return (
                <AcrossEvent
                    type="right"
                    key={layer}
                    layer={layer}
                    eventData={data.event!}
                    dateString={dateString}
                    eventHeight={eventHeight}
                />
            );
        case 'acrossRightEnd':
            return (
                <AcrossEvent
                    type="rightEnd"
                    key={layer}
                    layer={layer}
                    eventData={data.event!}
                    dateString={dateString}
                    eventHeight={eventHeight}
                />
            );
        case 'acrossClosed':
            return (
                <AcrossEvent
                    type="closed"
                    key={layer}
                    layer={layer}
                    eventData={data.event!}
                    dateString={dateString}
                    eventHeight={eventHeight}
                />
            );
        case 'within':
            return (
                <WithinEvent
                    type="middle"
                    key={layer}
                    layer={layer}
                    eventData={data.event!}
                    eventHeight={eventHeight}
                />
            );
        case 'withinLeftEnd':
            return (
                <WithinEvent
                    type="leftEnd"
                    key={layer}
                    layer={layer}
                    eventData={data.event!}
                    eventHeight={eventHeight}
                />
            );
        case 'withinRightEnd':
            return (
                <WithinEvent
                    type="rightEnd"
                    key={layer}
                    layer={layer}
                    eventData={data.event!}
                    eventHeight={eventHeight}
                />
            );
        case 'filler':
            return <FillerEvent key={layer} eventHeight={eventHeight} />;
        default:
            throw new Error('invalid LayerData type');
    }
}
