import axios from 'axios';

import { apiEndPoint } from './endpoint';

const UserAPI = axios.create({
    baseURL: `${apiEndPoint}/user`,
});

export const patchProfileAPI = (newProfile: FormData, accessToken: string | null) =>
    UserAPI.patch('/profile/', newProfile, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'content-type': 'multipart/form-data',
        },
    });

export const getProfileAPI = (accessToken: string | null) =>
    UserAPI.get(`/profile/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
