import { FullSchedule, LayeredEvents } from '@customTypes/ScheduleTypes';
import { formatDate } from '@utils/formatting';

function compareEndAt(eventA: FullSchedule, eventB: FullSchedule) {
    const aEnd = eventA.end_at.split(' ')[0];
    const bEnd = eventB.end_at.split(' ')[0];
    if (aEnd == bEnd) {
        return 0;
    } else if (aEnd > bEnd) {
        return 1;
    }
    return -1;
}

function isDateIncluded(date: Date, event: FullSchedule) {
    return (
        formatDate(date) >= event.start_at.split(' ')[0] &&
        formatDate(date) <= event.end_at.split(' ')[0]
    );
}

function sortEvents(events: FullSchedule[]) {
    let acrossEvents = <FullSchedule[]>[];
    let withinEvents = <FullSchedule[]>[];
    events.forEach(event => {
        if (event.start_at.split(' ')[0] === event.end_at.split(' ')[0]) {
            withinEvents.push({ ...event, layer: 0 });
        } else acrossEvents.push({ ...event, layer: 0 });
    });
    acrossEvents.sort(compareEndAt);
    withinEvents.sort(compareEndAt);
    return { acrossEvents, withinEvents };
}

export default function getLayeredEvents(
    dates: Date[],
    events: FullSchedule[],
) {
    const { acrossEvents, withinEvents } = sortEvents(events);
    let layeredEvents = <LayeredEvents>{};
    dates.forEach(date => {
        const dateString = formatDate(date);
        layeredEvents[dateString] = {
            across: acrossEvents.filter(event => {
                return isDateIncluded(date, event);
            }),
            within: withinEvents.filter(event => {
                return isDateIncluded(date, event);
            }),
        };
    });
    return layeredEvents;
}
