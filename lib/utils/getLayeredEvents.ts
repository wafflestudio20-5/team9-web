import { FullSchedule, LayeredEvents } from '@customTypes/ScheduleTypes';

function compareEndAt(eventA: FullSchedule, eventB: FullSchedule) {
    if (eventA.end_at > eventB.end_at) return 1;
    if (eventA.end_at < eventB.end_at) return -1;
    return 0;
}

function isDateIncluded(date: string, start_at: string, end_at: string) {
    if (date <= end_at.split(' ')[0] && date >= start_at.split(' ')[0]) {
        return true;
    }
    return false;
}

function sortEvents(events: FullSchedule[]) {
    let acrossEvents = <FullSchedule[]>[],
        withinEvents = <FullSchedule[]>[];
    events.forEach(event => {
        if (event.start_at.split(' ')[0] !== event.end_at.split(' ')[0]) {
            acrossEvents.push({ ...event, layer: 0 });
        } else withinEvents.push({ ...event, layer: 0 });
    });
    acrossEvents.sort(compareEndAt);
    withinEvents.sort(compareEndAt);
    return { acrossEvents, withinEvents };
}

export default function getLayeredEvents(
    dates: Date[],
    months: FullSchedule[],
) {
    const { acrossEvents, withinEvents } = sortEvents(months);
    for (let i = 0; i < acrossEvents.length; i++) {
        let j = 1;
        if (
            acrossEvents[i - j] &&
            acrossEvents[i - j].end_at < acrossEvents[i].start_at
        ) {
            acrossEvents[i].layer! += 1;
        }
    }
    let layeredEvents = <LayeredEvents>{};
    dates.forEach(date => {
        layeredEvents[date.toDateString()] = {
            across: acrossEvents.filter(event => {
                return isDateIncluded(
                    date.toDateString(),
                    event.start_at,
                    event.end_at,
                );
            }),
            within: withinEvents.filter(event => {
                return isDateIncluded(
                    date.toDateString(),
                    event.start_at,
                    event.end_at,
                );
            }),
        };
    });
    return layeredEvents;
}
