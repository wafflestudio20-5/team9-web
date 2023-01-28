import axios from 'axios';

import { apiEndPoint, apiStagingEndPoint } from './endpoint';

export const followRequestAPI = (pk: number, accessToken: string | null) =>
    axios.post(
        `${apiStagingEndPoint}/social/network/`,
        { followee: { pk: pk } },
        { headers: { Authorization: `Bearer ${accessToken}` } },
    );

export const searchUserAPI = (searchBy: string) =>
    axios.get(
        `${apiStagingEndPoint}/social/search/candidate/?search=${searchBy}`,
    );
