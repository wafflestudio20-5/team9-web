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
        const layer = findAvailableLayer(layeredEvents, startDateString);
        while (isDateIncluded(dateObj, event)) {
            if (formatDate(dateObj) < formatDate(dates[0])) {
                dateObj.setDate(dateObj.getDate() + 1);
                continue;
            }
            if (formatDate(dateObj) > formatDate(dates[dates.length - 1])) {
                break;
            }
            if (
                formatDate(dateObj) === event.start_at.split(' ')[0] ||
                dateObj.getDay() === 0
            ) {
                layeredEvents[formatDate(dateObj)][layer] = {
                    type: 'across',
                    event: event,
                };
            } else {
                layeredEvents[formatDate(dateObj)][layer] = {
                    type: 'filler',
                    event: null,
                };
            }
            dateObj.setDate(dateObj.getDate() + 1);
        }
    });
}

function layerWithinEvents(
    withinEvents: FullSchedule[],
    layeredEvents: LayeredEvents,
) {
    withinEvents.forEach(event => {
        const startDateString = event.start_at.split(' ')[0];
        const layer = findAvailableLayer(layeredEvents, startDateString);
        console.log(layeredEvents[startDateString]);
        layeredEvents[startDateString][layer] = {
            type: 'within',
            event: event,
        };
    });
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
        layerWithinEvents(withinEvents, layeredEvents);
    }
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
    return layeredEvents;
}
