import axios from 'axios';
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useMemo,
    useState,
    useCallback,
} from 'react';
import Swal from 'sweetalert2';
import keys from '../secrets.json';

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
    email: string;
    birthdate: string;
    username: string;
}

interface SessionContextData {
    user: User | null;
    accessToken: string | null;
    login(loginInfo: LoginInfo): void;
    logout(): void;
    register(registerInfo: RegisterInfo): void;
    openGoogleLoginPage(): void;
    openKakaoLoginPage(): void;
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
});

const apiEndPoint = 'http://ec2-43-201-9-194.ap-northeast-2.compute.amazonaws.com/api/v1/user/'

const REACT_APP_BASE_BACKEND_URL = 'http://127.0.0.1:8000';

const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_KAKAO_REST_API_KEY } = keys;

export const useSessionContext = () => useContext(SessionContext);

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default function SessionProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    const login = (loginInfo: LoginInfo) => {
        // send login request using loginInfo
        // if login success, set user and accessToken
        axios
            .post(apiEndPoint + 'login/', loginInfo)
            .then(response => {
                setUser({
                    email: response.data.user.email,
                    birthdate: response.data.user.birthdate,
                    username: response.data.user.username,
                });
                setAccessToken(response.data.access_token);
                setRefreshToken(response.data.refresh_token);
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
            .post(apiEndPoint + 'logout/', {
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

    const register = (registerInfo: RegisterInfo) => {
        //send register request
        axios
            .post(apiEndPoint + 'registration/', registerInfo)
            .then(response => {
                setUser({
                    email: response.data.user.email,
                    birthdate: response.data.user.birthdate,
                    username: response.data.user.username,
                });
                setAccessToken(response.data.access_token);
                setRefreshToken(response.data.refresh_token);
                axios.defaults.headers.post['X-CSRFToken'] =
                    response.data._csrf;
            })
            .catch(error => {
                setTimeout(function () {
                    Swal.fire({
                        title: 'Cannot register',
                        confirmButtonText: 'OK',
                    });
                }, 10);
            });
    };

    // referenced https://www.hacksoft.io/blog/google-oauth2-with-django-react-part-2
    const openGoogleLoginPage = useCallback(() => {
        const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const redirectUri = 'api/v1/user/login/google/callback/';

        const scope = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' ');

        const params = {
            response_type: 'code',
            client_id: REACT_APP_GOOGLE_CLIENT_ID,
            redirect_uri: `${REACT_APP_BASE_BACKEND_URL}/${redirectUri}`,
            prompt: 'select_account',
            access_type: 'offline',
            scope,
        };

        const urlParams = new URLSearchParams(params).toString();

        window.location.href = `${googleAuthUrl}?${urlParams}`;
    }, []);

    const openKakaoLoginPage = useCallback(() => {
        const kakaoAuthUrl = 'https://kauth.kakao.com/oauth/authorize';
        const redirectUri = 'api/v1/user/login/kakao/callback/';

        const params = {
            response_type: 'code',
            client_id: REACT_APP_KAKAO_REST_API_KEY,
            redirect_uri: `${REACT_APP_BASE_BACKEND_URL}/${redirectUri}`,
        };

        const urlParams = new URLSearchParams(params).toString();

        window.location.href = `${kakaoAuthUrl}?${urlParams}`;
    }, []);

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
        }),
        [user, accessToken],
    );

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}
