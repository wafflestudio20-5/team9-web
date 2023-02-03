import { FullSchedule } from '@customTypes/ScheduleTypes';
import { formatDate } from './formatting';

export function isDateIncluded(date: Date, event: FullSchedule) {
    if (
        formatDate(date) >= event.start_at.split(' ')[0] &&
        formatDate(date) < event.end_at.split(' ')[0]
    ) {
        return true;
    }
    if (formatDate(date) === event.end_at.split(' ')[0])
        if (event.end_at.split(' ')[1] === '00:00:00') {
            if (event.start_at === event.end_at) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
}

export function getDatesInEvent(event: FullSchedule) {
    let dateStrings = [];
    let dateVar = new Date(event.start_at);
    while (isDateIncluded(dateVar, event)) {
        dateStrings.push(formatDate(dateVar));
        dateVar.setDate(dateVar.getDate() + 1);
    }
    return dateStrings;
}
