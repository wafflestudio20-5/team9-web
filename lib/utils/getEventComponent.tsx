import React from 'react';

import AcrossEvent from '@components/EventComponents/AcrossEvent';
import FillerEvent from '@components/EventComponents/FillerEvent';
import WithinEvent from '@components/EventComponents/WithinEvent';
import { LayerData } from '@customTypes/ScheduleTypes';

export default function getEventComponent({
    data,
    layer,
    eventHeight,
    independentView,
}: {
    data: LayerData[number];
    layer: number;
    eventHeight?: number;
    independentView?: boolean;
}) {
    const eh = eventHeight ? eventHeight : 20;
    const sh = independentView ? 5 : 3;
    if (data === null) {
        return <FillerEvent key={layer} eventHeight={eh} />;
    }
    if (data === undefined) {
        return;
    }
    if (!data.event) {
        return;
    }

    switch (data.type) {
        case 'acrossLeft':
            return (
                <AcrossEvent
                    type="left"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    eventHeight={eh}
                    forceTextDisplay={independentView}
                    slopeHeight={sh}
                />
            );
        case 'acrossLeftEnd':
            return (
                <AcrossEvent
                    type="leftEnd"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    eventHeight={eh}
                    forceTextDisplay={independentView}
                    slopeHeight={sh}
                />
            );
        case 'acrossMiddle':
            return (
                <AcrossEvent
                    type="middle"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    eventHeight={eh}
                    forceTextDisplay={independentView}
                    slopeHeight={sh}
                />
            );
        case 'acrossRight':
            return (
                <AcrossEvent
                    type="right"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    eventHeight={eh}
                    forceTextDisplay={independentView}
                    slopeHeight={sh}
                />
            );
        case 'acrossRightEnd':
            return (
                <AcrossEvent
                    type="rightEnd"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    eventHeight={eh}
                    forceTextDisplay={independentView}
                    slopeHeight={sh}
                />
            );
        case 'acrossClosedSat':
            return (
                <AcrossEvent
                    type="closedSat"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    eventHeight={eh}
                    forceTextDisplay={independentView}
                    slopeHeight={sh}
                />
            );
        case 'acrossClosedSun':
            return (
                <AcrossEvent
                    type="closedSun"
                    key={layer}
                    layer={layer}
                    eventData={data.event}
                    eventHeight={eh}
                    forceTextDisplay={independentView}
                    slopeHeight={sh}
                />
            );
        case 'within':
            return (
                <WithinEvent
                    type="middle"
                    key={layer}
                    eventData={data.event}
                    eventHeight={eh}
                    expandSides={independentView}
                />
            );
        case 'withinLeftEnd':
            return (
                <WithinEvent
                    type="leftEnd"
                    key={layer}
                    eventData={data.event}
                    eventHeight={eh}
                    expandSides={independentView}
                />
            );
        case 'withinRightEnd':
            return (
                <WithinEvent
                    type="rightEnd"
                    key={layer}
                    eventData={data.event}
                    eventHeight={eh}
                    expandSides={independentView}
                />
            );
        case 'filler':
            return <FillerEvent key={layer} eventHeight={eh} />;
        default:
            throw new Error('invalid LayerData type');
    }
}
