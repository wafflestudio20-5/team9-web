import { FullSchedule, LayeredEvents } from '@customTypes/ScheduleTypes';
import { formatDate, formatDatestringToDate } from '@utils/formatting';

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
        let dateObj = formatDatestringToDate(startDateString);
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

// function sortEvents(events: FullSchedule[]) {
//     // sort Events into across vs within
//     // add layer property to each event item
//     let acrossEvents = <FullSchedule[]>[];
//     let withinEvents = <FullSchedule[]>[];
//     events.forEach(event => {
//         if (event.start_at.split(' ')[0] === event.end_at.split(' ')[0]) {
//             withinEvents.push({ ...event, layer: 0 });
//         } else acrossEvents.push({ ...event, layer: 0 });
//     });
//     acrossEvents.sort(compareEndAt);
//     withinEvents.sort(compareEndAt);
//     for (let i = 0; i < acrossEvents.length; i++) {
//         let j = 1;
//         while (acrossEvents[i - j]) {
//             if (
//                 // overlaps with previous across Event
//                 acrossEvents[i - j].end_at.split(' ')[0] >=
//                 acrossEvents[i].start_at.split(' ')[0]
//             ) {
//                 acrossEvents[i].layer! += 1;
//                 j += 1;
//             } else {
//                 break;
//             }
//         }
//     }
//     return { acrossEvents, withinEvents };
// }

// export default function getLayeredEvents(
//     dates: Date[],
//     events: FullSchedule[],
// ) {
//     // spread event items into each date that they need to be mapped on
//     const { acrossEvents, withinEvents } = sortEvents(events);
//     let layeredEvents = <LayeredEvents>{};
//     dates.forEach(date => {
//         const dateString = formatDate(date);
//         layeredEvents[dateString] = {
//             across: acrossEvents.filter(event => {
//                 const isStartDate =
//                     formatDate(date) === event.start_at.split(' ')[0];
//                 const isNewWeek =
//                     date.getDay() === 0 && isDateIncluded(date, event);
//                 return isStartDate || isNewWeek;
//             }),
//             within: withinEvents.filter(event => {
//                 return isDateIncluded(date, event);
//             }),
//             day: date.getDay(),
//         };
//     });
//     return layeredEvents;
// }
