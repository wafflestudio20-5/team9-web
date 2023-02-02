import axios, { AxiosError } from 'axios';
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useMemo,
    useState,
    useEffect,
    useCallback,
} from 'react';
import Swal from 'sweetalert2';

import { apiEndPoint } from '@apis/endpoint';
import useLocalStorage from '@hooks/useLocalStorage';

//import keys from '../secrets.json';

interface LoginInfo {
    email: string;
    password: string;
}

interface RegisterInfo {
    username: string;
    email: string;
    password1: string;
    password2: string;
    birthdate: string;
}

interface User {
    pk: number;
    email: string;
    birthdate: string;
    username: string;
    image: string;
}

interface SessionContextData {
    user: User | null;
    accessToken: string | null;
    login(loginInfo: LoginInfo): void;
    logout(): void;
    register(registerInfo: RegisterInfo): Promise<RegisterErrorData>;
    openGoogleLoginPage(): void;
    openKakaoLoginPage(): void;
    postHandleSocialLogin(postSocialLoginData: PostSocialLoginData): void;
}

interface RegisterErrorData {
    error: boolean;
    username: string;
    email: string;
    password1: string;
    password2: string;
    birthdate: string;
}

interface PostSocialLoginData {
    accessToken: string | null;
    refreshToken: string | null;
    error: string | null;
}

const SessionContext = createContext<SessionContextData>({
    user: null,
    accessToken: null,
    login() {
        throw new Error('SessionContext not provided');
    },
    logout() {
        throw new Error('SessionContext not provided');
    },
    register() {
        throw new Error('SessionContext not provided');
    },
    openGoogleLoginPage() {
        throw new Error('SessionContext not provided');
    },
    openKakaoLoginPage() {
        throw new Error('SessionContext not provided');
    },
    postHandleSocialLogin() {
        throw new Error('SessionContext not provided');
    },
});

const REACT_APP_GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
const REACT_APP_KAKAO_REST_API_KEY =
    process.env.REACT_APP_KAKAO_REST_API_KEY || '';

export const useSessionContext = () => useContext(SessionContext);

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default function SessionProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null | undefined>(
        '',
    );

    const { stored, setStored } = useLocalStorage<string | null>(
        'refreshToken',
        '',
    );

    useEffect(() => {
        setRefreshToken(stored);
        getAccessTokenIfAvail(stored ? stored : '');
    }, [stored]);

    const getAccessTokenIfAvail = (storedRefreshToken: string) => {
        if (storedRefreshToken == '') {
            return;
        }

        axios
            .post(apiEndPoint + '/user/token/refresh/', {
                refresh: storedRefreshToken,
            })
            .then(response => {
                setAccessToken(response.data.access);
                return axios.get(apiEndPoint + '/user/profile/', {
                    headers: {
                        Authorization: `Bearer ${response.data.access}`,
                    },
                });
            })
            .then(response => {
                setUser({
                    pk: response.data.pk,
                    email: response.data.email,
                    birthdate: response.data.birthdate,
                    username: response.data.username,
                    image: response.data.image,
                });
            })
            .catch(error => {
                if (error.response.status === 401) {
                    return;
                } else {
                    console.log('Error in getting access token: ' + error);
                }
            });
    };

    const login = (loginInfo: LoginInfo) => {
        // send login request using loginInfo
        // if login success, set user and accessToken
        axios
            .post(apiEndPoint + '/user/login/', loginInfo)
            .then(response => {
                setUser({
                    pk: response.data.user.pk,
                    email: response.data.user.email,
                    birthdate: response.data.user.birthdate,
                    username: response.data.user.username,
                    image: response.data.user.image,
                });
                setAccessToken(response.data.access_token);
                setRefreshToken(response.data.refresh_token);
                setStored(response.data.refresh_token);
                axios.defaults.headers.post['X-CSRFToken'] =
                    response.data._csrf;
            })
            .catch(error => {
                setTimeout(function () {
                    Swal.fire({
                        title: 'Cannot login',
                        confirmButtonText: 'OK',
                    });
                }, 10);
            });
    };

    const logout = () => {
        // send logout request
        // if logout success, reset user and accessToken to null
        axios
            .post(apiEndPoint + '/user/logout/', {
                refresh: refreshToken,
            })
            .then(response => {
                setUser(null);
                setAccessToken(null);
            })
            .catch(error => {
                setTimeout(function () {
                    Swal.fire({
                        title: 'Cannot logout',
                        confirmButtonText: 'OK',
                    });
                }, 10);
            });
    };

    const register = async (registerInfo: RegisterInfo) => {
        //send register request

        try {
            const response = await axios.post(
                apiEndPoint + '/user/registration/',
                registerInfo,
            );
            setUser({
                pk: response.data.user.pk,
                email: response.data.user.email,
                birthdate: response.data.user.birthdate,
                username: response.data.user.username,
                image: response.data.user.image,
            });
            setAccessToken(response.data.access_token);
            setRefreshToken(response.data.refresh_token);
            setStored(response.data.refresh_token);
            axios.defaults.headers.post['X-CSRFToken'] = response.data._csrf;
            return {
                error: false,
                username: '',
                email: '',
                password1: '',
                password2: '',
                birthdate: '',
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                return {
                    error: true,
                    username: error.response?.data.username || '',
                    email: error.response?.data.email || '',
                    password1: error.response?.data.password1 || '',
                    password2: error.response?.data.password2 || '',
                    birthdate: error.response?.data.birthdate || '',
                };
            }

            //unknown error
            return {
                error: true,
                username: '',
                email: '',
                password1: '',
                password2: '',
                birthdate:
                    '알 수 없는 에러가 발생했습니다. 관리자에게 문의하세요.',
            };
        }
    };

    // referenced https://www.hacksoft.io/blog/google-oauth2-with-django-react-part-2
    const openGoogleLoginPage = useCallback(() => {
        const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const redirectUri = 'user/login/google/callback/';

        const scope = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' ');

        const params = {
            response_type: 'code',
            client_id: REACT_APP_GOOGLE_CLIENT_ID,
            redirect_uri: `${apiEndPoint}/${redirectUri}`,
            prompt: 'select_account',
            access_type: 'offline',
            scope,
        };

        const urlParams = new URLSearchParams(params).toString();

        window.location.href = `${googleAuthUrl}?${urlParams}`;
    }, []);

    const openKakaoLoginPage = useCallback(() => {
        const kakaoAuthUrl = 'https://kauth.kakao.com/oauth/authorize';
        const redirectUri = 'user/login/kakao/callback/';

        const params = {
            response_type: 'code',
            client_id: REACT_APP_KAKAO_REST_API_KEY,
            redirect_uri: `${apiEndPoint}/${redirectUri}`,
        };

        const urlParams = new URLSearchParams(params).toString();

        window.location.href = `${kakaoAuthUrl}?${urlParams}`;
    }, []);

    const postHandleSocialLogin = useCallback(
        (postSocialLoginData: PostSocialLoginData) => {
            if (postSocialLoginData.error !== null) {
                setTimeout(function () {
                    Swal.fire({
                        title: postSocialLoginData.error || 'Unknown error',
                        confirmButtonText: 'OK',
                    });
                }, 10);
                return;
            }
            setAccessToken(postSocialLoginData.accessToken);
            setRefreshToken(postSocialLoginData.refreshToken);
            setStored(postSocialLoginData.refreshToken);

            axios
                .get(apiEndPoint + '/user/profile/', {
                    headers: {
                        Authorization: `Bearer ${postSocialLoginData.accessToken}`,
                    },
                })
                .then(response => {
                    setUser({
                        pk: response.data.pk,
                        email: response.data.email,
                        birthdate: response.data.birthdate,
                        username: response.data.username,
                        image: response.data.image,
                    });
                    axios.defaults.headers.post['X-CSRFToken'] =
                        response.data._csrf;
                })
                .catch(error => {
                    console.log(error);
                    setTimeout(function () {
                        Swal.fire({
                            title: 'Error in getting user info',
                            confirmButtonText: 'OK',
                        });
                    }, 10);
                });
        },
        [],
    );

    // functions related to refresh token may be added later

    const value = useMemo(
        () => ({
            user,
            accessToken,
            login,
            logout,
            register,
            openGoogleLoginPage,
            openKakaoLoginPage,
            postHandleSocialLogin,
        }),
        [user, accessToken],
    );

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}
