import axios from 'axios';

import { apiEndPoint } from './endpoint';

import { Schedule } from '@customTypes/ScheduleTypes';

const CalendarAPI = axios.create({
    baseURL: `${apiEndPoint}/calendar`,
    withCredentials: true,
});

interface CalendarURLParams {
    email: string;
    from: string;
    to: string;
}

const getURLWithParams = (urlParams: CalendarURLParams) =>
    `?email=${urlParams.email}&from=${urlParams.from}&to=${urlParams.to}`;

export const createScheduleAPI = (
    urlParams: CalendarURLParams,
    newSchedule: Schedule,
    accessToken: string | null,
) =>
    CalendarAPI.post(
        `/schedule/?email=${urlParams.email}&from=${urlParams.from}&to=${urlParams.to}`,
        newSchedule,
        { headers: { Authorization: `Bearer ${accessToken}` } },
    );

export const getEntireScheduleAPI = (
    urlParams: CalendarURLParams,
    accessToken: string | null,
) =>
    CalendarAPI.get(
        `/schedule/?email=${urlParams.email}&from=${urlParams.from}&to=${urlParams.to}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
    );

export const getParticularScheduleAPI = (
    urlParams: CalendarURLParams,
    pk: number,
    accessToken: string | null,
) =>
    CalendarAPI.get(
        `/schedule/${pk}/?email=${urlParams.email}&from=${urlParams.from}&to=${urlParams.to}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
    );

export const editScheduleAPI = (
    urlParams: CalendarURLParams,
    pk: number,
    newSchedule: Schedule,
    accessToken: string | null,
) =>
    CalendarAPI.patch(
        `/schedule/${pk}/?email=${urlParams.email}&from=${urlParams.from}&to=${urlParams.to}`,
        newSchedule,
        { headers: { Authorization: `Bearer ${accessToken}` } },
    );

export const deleteScheduleAPI = (
    urlParams: CalendarURLParams,
    pk: number,
    accessToken: string | null,
) =>
    CalendarAPI.delete(
        `/schedule/${pk}/?email=${urlParams.email}&from=${urlParams.from}&to=${urlParams.to}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
    );
