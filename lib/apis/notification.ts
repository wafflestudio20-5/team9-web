import axios from 'axios';

import { apiEndPoint } from './endpoint';

export const getFollowRequests = (accessToken: string | null) =>
    axios.get(`${apiEndPoint}/social/network/notification`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const getScheduleRequests = (accessToken: string | null) =>
    axios.get(`${apiEndPoint}/calendar/schedule/notification`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
