import axios from 'axios';

import { apiEndPoint } from './endpoint';

import { Schedule } from '@customTypes/ScheduleTypes';

const CalendarAPI = axios.create({
    baseURL: `${apiEndPoint}/calendar/schedule`,
});

interface CalendarURLParams {
    pk: number;
    from: string;
    to: string;
}

const getCommonURLWithParams = (urlParams: CalendarURLParams) =>
    `?pk=${urlParams.pk}&from=${urlParams.from}&to=${urlParams.to}`;

export const createScheduleAPI = (
    urlParams: CalendarURLParams,
    newSchedule: Schedule,
    accessToken: string | null,
) =>
    CalendarAPI.post(`/${getCommonURLWithParams(urlParams)}`, newSchedule, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const getEntireScheduleAPI = (
    urlParams: CalendarURLParams,
    accessToken: string | null,
) =>
    CalendarAPI.get(`/${getCommonURLWithParams(urlParams)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const getParticularScheduleAPI = (
    urlParams: CalendarURLParams,
    accessToken: string | null,
) =>
    CalendarAPI.get(`/${urlParams.pk}/${getCommonURLWithParams(urlParams)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const editScheduleAPI = (
    urlParams: CalendarURLParams,
    newSchedule: Schedule,
    accessToken: string | null,
) =>
    CalendarAPI.patch(
        `/${urlParams.pk}/${getCommonURLWithParams(urlParams)}`,
        newSchedule,
        { headers: { Authorization: `Bearer ${accessToken}` } },
    );

export const deleteScheduleAPI = (
    urlParams: CalendarURLParams,
    accessToken: string | null,
) =>
    CalendarAPI.delete(
        `/${urlParams.pk}/${getCommonURLWithParams(urlParams)}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
    );
