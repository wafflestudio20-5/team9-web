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
    if (!layeredEvents[dateString]) {
        return 0;
    }
    let i = 0;
    while (layeredEvents[dateString][i]) {
        i++;
    }
    return i;
}

export default function getLayeredEvents(
    events: FullSchedule[],
    dates: Date[],
) {
    let acrossEvents = <FullSchedule[]>[];
    let withinEvents = <FullSchedule[]>[];
    let layeredEvents = <LayeredEvents>{};
    dates.forEach(date => {
        layeredEvents[formatDate(date)] = { 0: null };
    });
    events.forEach(event => {
        if (event.start_at.split(' ')[0] === event.end_at.split(' ')[0]) {
            withinEvents.push(event);
        } else acrossEvents.push(event);
    });
    acrossEvents.sort(compareEndAt);
    withinEvents.sort(compareEndAt);
    acrossEvents.forEach(event => {
        const startDateString = event.start_at.split(' ')[0];
        let dateObj = new Date(startDateString);
        const layer = findAvailableLayer(layeredEvents, startDateString);
        while (isDateIncluded(dateObj, event)) {
            if (formatDate(dateObj) < formatDate(dates[0])) {
                dateObj.setDate(dateObj.getDate() + 1);
                continue;
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
    withinEvents.forEach(event => {
        const startDateString = event.start_at.split(' ')[0];
        const layer = findAvailableLayer(layeredEvents, startDateString);
        layeredEvents[startDateString][layer] = {
            type: 'within',
            event: event,
        };
    });
    return layeredEvents;
}
