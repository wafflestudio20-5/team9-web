import axios from 'axios';

import { apiEndPoint } from './endpoint';

export const followRequestAPI = (pk: number, accessToken: string | null) =>
    axios.post(
        `${apiEndPoint}/social/network/followee/`,
        { followee: { pk: pk } },
        { headers: { Authorization: `Bearer ${accessToken}` } },
    );

export const searchUserAPI = (searchBy: string) =>
    axios.get(`${apiEndPoint}/social/search/candidate/?search=${searchBy}`);
