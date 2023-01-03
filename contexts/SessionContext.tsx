import axios from 'axios';
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useMemo,
    useState,
} from 'react';
import Swal from 'sweetalert2';

interface LoginInfo {
    email: string;
    password: string;
}

interface RegisterInfo {
    username: string;
    email: string;
    password1: string;
    password2: string;
    birthday: string;
}

interface User {
    email: string;
    birthday: string;
    username: string;
}

interface SessionContextData {
    user: User | null;
    accessToken: string | null;
    login(loginInfo: LoginInfo): void;
    logout(): void;
    register(registerInfo: RegisterInfo): void;
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
});

const apiEndPoint = 'http://127.0.0.1:8000/api/v1/user/';

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
                    birthday: response.data.user.birthday,
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
                    birthday: response.data.user.birthday,
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

    // functions related to refresh token may be added later

    const value = useMemo(
        () => ({
            user,
            accessToken,
            login,
            logout,
            register,
        }),
        [user, accessToken],
    );

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}
