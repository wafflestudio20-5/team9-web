import axios from 'axios';

import { apiEndPoint } from './endpoint';

export const getFollowRequests = (accessToken: string | null) =>
    axios.get(`${apiEndPoint}/social/network/notification/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const getScheduleRequests = (accessToken: string | null) =>
    axios.get(`${apiEndPoint}/calendar/schedule/notification/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const responseFollowRequests = (id: number, approved: boolean, accessToken: string | null) =>
    
axios.patch(`${apiEndPoint}/social/network/follower/${id}/`, {
        approved: approved,
    }, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const responseScheduleRequests = (id: number, status: number, accessToken: string | null) =>
    axios.patch(`${apiEndPoint}/calendar/schedule/${id}/attendance/`, {status: status}, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
