import { FullSchedule, LayeredEvents } from '@customTypes/ScheduleTypes';
import { formatDate } from '@utils/formatting';

function compareEndAt(eventA: FullSchedule, eventB: FullSchedule) {
    const aEnd = eventA.end_at;
    const bEnd = eventB.end_at;
    if (aEnd == bEnd) {
        return 0;
    } else if (aEnd > bEnd) {
        return 1;
    }
    return -1;
}

function isDateIncluded(date: Date | string, event: FullSchedule) {
    if (date instanceof Date) {
        return (
            formatDate(date) >= event.start_at.split(' ')[0] &&
            formatDate(date) <= event.end_at.split(' ')[0]
        );
    }
    throw new Error('wrong parameter type in fn IsDateIncluded');
}

function findAvailableLayer(layeredEvents: LayeredEvents, dateString: string) {
    if (layeredEvents[dateString] === undefined) {
        return 0;
    }
    let i = 0;
    while (layeredEvents[dateString][i]) {
        i++;
    }
    return i;
}

function getInitialLayeredEvents(dates: Date[]) {
    let layeredEvents = <LayeredEvents>{};
    dates.forEach(date => {
        layeredEvents[formatDate(date)] = { 0: null };
    });
    return layeredEvents;
}

function sortEvents(events: FullSchedule[]) {
    let acrossEvents = <FullSchedule[]>[];
    let withinEvents = <FullSchedule[]>[];

    events.forEach(event => {
        if (event.start_at.split(' ')[0] === event.end_at.split(' ')[0]) {
            withinEvents.push(event);
        } else acrossEvents.push(event);
    });
    acrossEvents.sort(compareEndAt);
    withinEvents.sort(compareEndAt);
    return { acrossEvents, withinEvents };
}

function layerAcrossEvents(
    acrossEvents: FullSchedule[],
    dates: Date[],
    layeredEvents: LayeredEvents,
) {
    acrossEvents.forEach(event => {
        const startDateString =
            event.start_at.split(' ')[0] < formatDate(dates[0])
                ? formatDate(dates[0])
                : event.start_at.split(' ')[0];
        let dateObj = new Date(startDateString);
        while (isDateIncluded(dateObj, event)) {
            if (formatDate(dateObj) < formatDate(dates[0])) {
                dateObj.setDate(dateObj.getDate() + 1);
                continue;
            }
            if (formatDate(dateObj) > formatDate(dates[dates.length - 1])) {
                break;
            }

            if (formatDate(dateObj) === event.start_at.split(' ')[0]) {
                let newDateObj = new Date(formatDate(dateObj));
                const layer = findAvailableLayer(
                    layeredEvents,
                    formatDate(newDateObj),
                );
                while (isDateIncluded(newDateObj, event)) {
                    console.log(newDateObj);
                    if (formatDate(newDateObj) < formatDate(dates[0])) {
                        newDateObj.setDate(newDateObj.getDate() + 1);
                        continue;
                    }
                    if (
                        formatDate(newDateObj) >
                        formatDate(dates[dates.length - 1])
                    ) {
                        break;
                    }
                    if (
                        formatDate(newDateObj) ===
                            event.start_at.split(' ')[0] &&
                        newDateObj.getDay() === 6
                    ) {
                        layeredEvents[formatDate(newDateObj)][layer] = {
                            type: 'acrossClosed',
                            event: event,
                        };
                    } else if (newDateObj.getDay() === 0) {
                        layeredEvents[formatDate(newDateObj)][layer] = {
                            type: 'acrossLeftEnd',
                            event: event,
                        };
                    } else if (
                        formatDate(newDateObj) === event.start_at.split(' ')[0]
                    ) {
                        layeredEvents[formatDate(newDateObj)][layer] = {
                            type: 'acrossLeft',
                            event: event,
                        };
                    } else if (newDateObj.getDay() === 6) {
                        layeredEvents[formatDate(newDateObj)][layer] = {
                            type: 'acrossRightEnd',
                            event: event,
                        };
                    } else if (
                        formatDate(newDateObj) === event.end_at.split(' ')[0]
                    ) {
                        layeredEvents[formatDate(newDateObj)][layer] = {
                            type: 'acrossRight',
                            event: event,
                        };
                    } else {
                        layeredEvents[formatDate(newDateObj)][layer] = {
                            type: 'acrossMiddle',
                            event: event,
                        };
                    }
                    newDateObj.setDate(newDateObj.getDate() + 1);
                }
            }

            dateObj.setDate(dateObj.getDate() + 1);
        }
    });
}

function layerWithinEvents(
    withinEvents: FullSchedule[],
    dates: Date[],
    layeredEvents: LayeredEvents,
) {
    withinEvents.forEach(event => {
        const dateString = event.start_at.split(' ')[0];
        const dateObj = new Date(dateString);
        const layer = findAvailableLayer(layeredEvents, dateString);

        if (dateObj.getDay() === 0) {
            layeredEvents[dateString][layer] = {
                type: 'withinLeftEnd',
                event: event,
            };
        } else if (dateObj.getDay() === 6) {
            layeredEvents[dateString][layer] = {
                type: 'withinRightEnd',
                event: event,
            };
        } else {
            layeredEvents[dateString][layer] = {
                type: 'within',
                event: event,
            };
        }
    });
}

function fillSkippedLayers(dates: Date[], layeredEvents: LayeredEvents) {
    for (let i = 0; i < dates.length; i++) {
        const dateString = formatDate(dates[i]);
        const layers = Object.keys(layeredEvents[dateString]).map(str => {
            return Number(str);
        });
        const maxLayer = layers[layers.length - 1];
        for (let j = 0; j <= maxLayer; j++) {
            if (!layeredEvents[dateString][j]) {
                layeredEvents[dateString][j] = null;
            }
        }
    }
}
export default function getLayeredEvents(
    events: FullSchedule[],
    dates: Date[],
) {
    let layeredEvents = getInitialLayeredEvents(dates);
    if (!events) {
        return layeredEvents;
    }
    const { acrossEvents, withinEvents } = sortEvents(events);
    if (acrossEvents) {
        layerAcrossEvents(acrossEvents, dates, layeredEvents);
    }
    if (withinEvents) {
        layerWithinEvents(withinEvents, dates, layeredEvents);
    }
    fillSkippedLayers(dates, layeredEvents);
    return layeredEvents;
}

export function getLayeredAcrossEvents(events: FullSchedule[], dates: Date[]) {
    let layeredEvents = getInitialLayeredEvents(dates);
    if (!events) {
        return layeredEvents;
    }
    const { acrossEvents } = sortEvents(events);
    if (acrossEvents) {
        layerAcrossEvents(acrossEvents, dates, layeredEvents);
    }
    fillSkippedLayers(dates, layeredEvents);
    return layeredEvents;
}
