import {
    DailyLayerData,
    FullSchedule,
    LayeredEvents,
    LayeredWeeklyWithinEvents,
    WeeklyWithinEvents,
} from '@customTypes/ScheduleTypes';
import { getDatesInEvent, isDateIncluded } from '@utils/calcEventDates';
import { formatDate, formatDateWithTime } from '@utils/formatting';

function compareEndAt(eventA: FullSchedule, eventB: FullSchedule) {
    const aEnd = eventA.end_at;
    const bEnd = eventB.end_at;
    if (aEnd === bEnd) {
        return 0;
    } else if (aEnd > bEnd) {
        return 1;
    }
    return -1;
}

function compareLength(eventA: FullSchedule, eventB: FullSchedule) {
    const aStart = new Date(eventA.start_at);
    const aEnd = new Date(eventA.end_at);
    const bStart = new Date(eventB.start_at);
    const bEnd = new Date(eventB.end_at);
    const aDuration = aEnd.getTime() - aStart.getTime();
    const bDuration = bEnd.getTime() - bStart.getTime();
    if (aDuration === bDuration) {
        return 0;
    } else if (aDuration > bDuration) {
        return -1;
    }
    return 1;
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
    const layeredEvents = <LayeredEvents>{};
    dates.forEach(date => {
        layeredEvents[formatDate(date)] = { 0: null };
    });
    return layeredEvents;
}

function sortEvents(events: FullSchedule[]) {
    const acrossEvents = <FullSchedule[]>[];
    const withinEvents = <FullSchedule[]>[];

    events.forEach(event => {
        const startDate = new Date(event.start_at);
        const endDate = new Date(event.end_at);
        if (startDate.toDateString() === endDate.toDateString()) {
            withinEvents.push(event);
        } else if (
            event.end_at.split(' ')[1] === '00:00:00' &&
            endDate.getTime() - startDate.getTime() <= 24 * 60 * 60 * 1000
        ) {
            withinEvents.push(event);
        } else {
            acrossEvents.push(event);
        }
    });
    acrossEvents.sort(compareEndAt);
    withinEvents.sort(compareEndAt);
    return { acrossEvents, withinEvents };
}

export function getFrozenEvents(events: FullSchedule[]) {
    const frozenEvents = <FullSchedule[]>[];
    const scrollableEvents = <FullSchedule[]>[];
    if (!events) {
        return { frozenEvents, scrollableEvents };
    }
    events.forEach(event => {
        if (!event) {
            return;
        }
        const startDate = new Date(event.start_at);
        const endDate = new Date(event.end_at);
        if (endDate.getTime() - startDate.getTime() >= 24 * 60 * 60 * 1000) {
            frozenEvents.push(event);
        } else {
            scrollableEvents.push(event);
        }
    });
    return { frozenEvents, scrollableEvents };
}

function getAcrossType(dateObj: Date, event: FullSchedule, dates: Date[]) {
    if (
        formatDate(dateObj) === event.start_at.split(' ')[0] &&
        dateObj.getDay() === 6
    ) {
        return 'acrossClosedSat';
    } else if (
        (formatDate(dateObj) === event.end_at.split(' ')[0] ||
            (event.end_at.split(' ')[1] === '00:00:00' &&
                new Date(event.end_at).getTime() - dateObj.getTime() <=
                    24 * 60 * 60 * 1000)) &&
        dateObj.getDay() === 0
    ) {
        return 'acrossClosedSun';
    } else if (dateObj.getDay() === 0) {
        return 'acrossLeftEnd';
    } else if (formatDate(dateObj) === event.start_at.split(' ')[0]) {
        return 'acrossLeft';
    } else if (dateObj.getDay() === 6) {
        return 'acrossRightEnd';
    } else if (
        formatDate(dateObj) === event.end_at.split(' ')[0] ||
        (event.end_at.split(' ')[1] === '00:00:00' &&
            new Date(event.end_at).getTime() - dateObj.getTime() <=
                24 * 60 * 60 * 1000)
    ) {
        return 'acrossRight';
    } else {
        return 'acrossMiddle';
    }
}

function getAcrossTypeForIndepView(dateObj: Date, event: FullSchedule) {
    if (formatDate(dateObj) === event.start_at.split(' ')[0]) {
        return 'acrossLeftEnd';
    } else if (
        formatDate(dateObj) === event.end_at.split(' ')[0] ||
        (event.end_at.split(' ')[1] === '00:00:00' &&
            new Date(event.end_at).getTime() - dateObj.getTime() <=
                24 * 60 * 60 * 1000)
    ) {
        return 'acrossRightEnd';
    } else {
        return 'acrossMiddle';
    }
}

function layerAcrossEvents(
    acrossEvents: FullSchedule[],
    dates: Date[],
    layeredEvents: LayeredEvents,
    independentView: boolean | undefined,
) {
    acrossEvents.forEach(event => {
        const startDateString =
            event.start_at.split(' ')[0] < formatDate(dates[0])
                ? formatDate(dates[0])
                : event.start_at.split(' ')[0];
        const dateObj = new Date(`${startDateString} 00:00:00`);
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
                formatDate(dateObj) === formatDate(dates[0])
            ) {
                const newDateObj = new Date(`${formatDate(dateObj)} 00:00:00`);
                const layer = findAvailableLayer(
                    layeredEvents,
                    formatDate(newDateObj),
                );

                while (isDateIncluded(newDateObj, event)) {
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

                    layeredEvents[formatDate(newDateObj)][layer] = {
                        type: `${
                            independentView
                                ? getAcrossTypeForIndepView(newDateObj, event)
                                : getAcrossType(newDateObj, event, dates)
                        }`,
                        event: event,
                    };

                    newDateObj.setDate(newDateObj.getDate() + 1);
                }
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
        const [dateString] = getDatesInEvent(event);
        console.log(dateString);
        const dateObj = new Date(dateString);
        const layer = findAvailableLayer(layeredEvents, dateString);
        if (!layeredEvents[dateString]) {
            return;
        }

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
export function getLayeredEvents(
    events: FullSchedule[],
    dates: Date[],
    independentView?: boolean,
) {
    const layeredEvents = getInitialLayeredEvents(dates);
    if (!events) {
        return layeredEvents;
    }
    const { acrossEvents, withinEvents } = sortEvents(events);
    console.log(acrossEvents);
    console.log(withinEvents);
    if (acrossEvents) {
        layerAcrossEvents(acrossEvents, dates, layeredEvents, independentView);
    }
    if (withinEvents) {
        layerWithinEvents(withinEvents, layeredEvents);
    }
    fillSkippedLayers(dates, layeredEvents);
    return layeredEvents;
}

function areTimesOverlapping(eventA: FullSchedule, eventB: FullSchedule) {
    const minimumHeightAsMilliseconds = 20 / (1320 / (24 * 60 * 60 * 1000));
    const aEndasDisplayed = new Date(eventA.end_at);
    aEndasDisplayed.setMilliseconds(
        Math.max(
            aEndasDisplayed.getTime() - new Date(eventA.start_at).getTime(),
            minimumHeightAsMilliseconds,
        ),
    );
    const bEndasDisplayed = new Date(eventB.end_at);
    bEndasDisplayed.setMilliseconds(
        Math.max(
            bEndasDisplayed.getTime() - new Date(eventB.start_at).getTime(),
            minimumHeightAsMilliseconds,
        ),
    );
    if (
        formatDateWithTime(aEndasDisplayed) <= eventB.start_at ||
        formatDateWithTime(bEndasDisplayed) <= eventA.start_at
    ) {
        return false;
    } else return true;
}

function getDailyLayerData(events: FullSchedule[]) {
    const dailyLayerData = <DailyLayerData>{ 0: null };
    if (!events) {
        return dailyLayerData;
    }
    const dailyEvents = [...events];
    dailyEvents.sort(compareLength);

    dailyEvents.forEach(event => {
        let layer = 0;
        while (1) {
            const data = dailyLayerData[layer];
            if (!data) {
                dailyLayerData[layer] = [{ textTop: 0, event: event }];
                break;
            } else {
                let needLayerIncrease = false;
                for (let i = 0; i < data.length; i++) {
                    needLayerIncrease =
                        needLayerIncrease ||
                        areTimesOverlapping(event, data[i].event);
                }
                if (needLayerIncrease) {
                    layer += 1;
                } else {
                    dailyLayerData[layer]?.push({ textTop: 0, event: event });
                    break;
                }
            }
        }
    });
    return dailyLayerData;
}

function assignTextTop(
    layeredWeeklyWithinEvents: LayeredWeeklyWithinEvents,
    dates: Date[],
) {
    dates.forEach(date => {
        const dailyLayerData = layeredWeeklyWithinEvents[formatDate(date)];
        let layer = 0;
        while (1) {
            if (!dailyLayerData[layer] || !dailyLayerData[layer + 1]) {
                break;
            }

            for (let i = 0; i < dailyLayerData[layer]?.length!; i++) {
                const lowerEvent = dailyLayerData[layer]![i].event;
                for (let j = 0; j < dailyLayerData[layer + 1]?.length!; j++) {
                    const upperEvent = dailyLayerData[layer + 1]![j].event;
                    if (
                        lowerEvent.start_at >= upperEvent.start_at &&
                        lowerEvent.start_at < upperEvent.end_at
                    ) {
                        const lowerStart = new Date(lowerEvent.start_at);
                        const upperEnd = new Date(upperEvent.end_at);
                        dailyLayerData[layer]![i].textTop = Math.max(
                            (upperEnd.getTime() - lowerStart.getTime()) *
                                (1320 / (24 * 60 * 60 * 1000)),
                            20,
                        );
                    }
                }
            }
            layer++;
        }
        layeredWeeklyWithinEvents[formatDate(date)] = dailyLayerData;
    });
}

export function getLayeredWeeklyWithinEvents(
    events: FullSchedule[],
    dates: Date[],
) {
    const layeredWeeklyWithinEvents = <LayeredWeeklyWithinEvents>{};
    dates.forEach(date => {
        layeredWeeklyWithinEvents[formatDate(date)] = { 0: null };
    });
    if (!events) {
        return layeredWeeklyWithinEvents;
    }
    const { withinEvents } = sortEvents(events);
    const weeklyWithinEvents = <WeeklyWithinEvents>{};
    if (!withinEvents) {
        return layeredWeeklyWithinEvents;
    }
    withinEvents.forEach(event => {
        const dateString = event.start_at.split(' ')[0];
        if (!weeklyWithinEvents[dateString]) {
            weeklyWithinEvents[dateString] = [event];
        } else {
            weeklyWithinEvents[dateString].push(event);
        }
    });
    dates.forEach(date => {
        layeredWeeklyWithinEvents[formatDate(date)] = getDailyLayerData(
            weeklyWithinEvents[formatDate(date)],
        );
    });
    assignTextTop(layeredWeeklyWithinEvents, dates);
    return layeredWeeklyWithinEvents;
}
