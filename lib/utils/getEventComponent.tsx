import React from 'react';

import AcrossEvent from '@components/EventComponents/AcrossEvent';
import FillerEvent from '@components/EventComponents/FillerEvent';
import WithinEvent from '@components/EventComponents/WithinEvent';
import { FullSchedule, LayerData } from '@customTypes/ScheduleTypes';

interface getEventComponentOptions {
    eventHeight?: number;
    enforceEnd?: boolean;
}

export default function getEventComponent({
    dateString,
    data,
    layer,
    eventHeight,
    enforceEnd,
}: {
    dateString: string;
    data: LayerData[number];
    layer: number;
    eventHeight?: number;
    enforceEnd?: boolean;
}) {
    const eh = eventHeight ? eventHeight : 20;
    if (data === null) {
        return <FillerEvent key={layer} eventHeight={eh} />;
    }
    if (data === undefined) {
        return;
    }
    if (!data.event) {
        return;
    }
    const getEnforcedType = (type: string) => {
        switch (type) {
            case 'acrossLeft':
                return 'acrossLeftEnd';
            case 'acrossRight':
                return 'acrossRightEnd';
            default:
                return type;
        }
    };

    switch (enforceEnd ? getEnforcedType(data.type) : data.type) {
        case 'acrossLeft':
            return (
                <AcrossEvent
                    type="left"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    dateString={dateString}
                    eventHeight={eh}
                />
            );
        case 'acrossLeftEnd':
            return (
                <AcrossEvent
                    type="leftEnd"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    dateString={dateString}
                    eventHeight={eh}
                />
            );
        case 'acrossMiddle':
            return (
                <AcrossEvent
                    type="middle"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    dateString={dateString}
                    eventHeight={eh}
                />
            );
        case 'acrossRight':
            return (
                <AcrossEvent
                    type="right"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    dateString={dateString}
                    eventHeight={eh}
                />
            );
        case 'acrossRightEnd':
            return (
                <AcrossEvent
                    type="rightEnd"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    dateString={dateString}
                    eventHeight={eh}
                />
            );
        case 'acrossClosedSat':
            return (
                <AcrossEvent
                    type="closedSat"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    dateString={dateString}
                    eventHeight={eh}
                />
            );
        case 'acrossClosedSun':
            return (
                <AcrossEvent
                    type="closedSun"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    dateString={dateString}
                    eventHeight={eh}
                />
            );
        case 'within':
            return (
                <WithinEvent
                    type="middle"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    eventHeight={eh}
                />
            );
        case 'withinLeftEnd':
            return (
                <WithinEvent
                    type="leftEnd"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    eventHeight={eh}
                />
            );
        case 'withinRightEnd':
            return (
                <WithinEvent
                    type="rightEnd"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    eventHeight={eh}
                />
            );
        case 'filler':
            return <FillerEvent key={layer} eventHeight={eh} />;
        default:
            throw new Error('invalid LayerData type');
    }
}
