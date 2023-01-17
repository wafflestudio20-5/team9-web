import axios from 'axios';

import { apiEndPoint } from './endpoint';

import { Schedule } from '@customTypes/ScheduleTypes';

const CalendarAPI = axios.create({
    baseURL: `${apiEndPoint}/calendar/schedule`,
});

export interface CalendarURLParams {
    pk: number;
    from: string;
    to: string;
}

export interface CalendarURLParamsEmail {
    email: string;
    from: string;
    to: string;
}

const getCommonURLWithParams = (urlParams: CalendarURLParams) =>
    `?pk=${urlParams.pk}&from=${urlParams.from}&to=${urlParams.to}`;

// temp (will be removed after merging backend pr)
const getCommonURLWithParamsEmail = (urlParams: CalendarURLParamsEmail) =>
    `?meail=${urlParams.email}&from=${urlParams.from}&to=${urlParams.to}`;

export const createScheduleAPI = (
    newSchedule: Schedule,
    urlParams: CalendarURLParams,
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

// temp (will be removed after merging backend pr)
export const getEntireScheduleAPIEmail = (
    urlParams: CalendarURLParamsEmail,
    accessToken: string | null,
) =>
    CalendarAPI.get(`/${getCommonURLWithParamsEmail(urlParams)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const getParticularScheduleAPI = (
    scheduleId: number,
    urlParams: CalendarURLParams,
    accessToken: string | null,
) =>
    CalendarAPI.get(`/${scheduleId}/${getCommonURLWithParams(urlParams)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

// 500 error (have to discuss with backend)
export const editScheduleAPI = (
    scheduleId: number,
    newSchedule: Schedule,
    urlParams: CalendarURLParams,
    accessToken: string | null,
) =>
    CalendarAPI.patch(
        `/${scheduleId}/${getCommonURLWithParams(urlParams)}`,
        newSchedule,
        { headers: { Authorization: `Bearer ${accessToken}` } },
    );

export const deleteScheduleAPI = (
    scheduleId: number,
    urlParams: CalendarURLParams,
    accessToken: string | null,
) =>
    CalendarAPI.delete(`/${scheduleId}/${getCommonURLWithParams(urlParams)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
