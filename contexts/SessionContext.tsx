import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useState,
} from 'react';

type LoginInfo = {
    id: string;
    password: string;
};

type User = {
    id: string;
    name: string;
};

type SessionContextData = {
    user: User | null;
    accessToken: string | null;
    login(loginInfo: LoginInfo): void;
    logout(): void;
};

const SessionContext = createContext<SessionContextData>({
    user: null,
    accessToken: null,
    login() {
        throw new Error('SessionContext not provided');
    },
    logout() {
        throw new Error('SessionContext not provided');
    },
});

export const useSessionContext = () => useContext(SessionContext);

function SessionProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const login = (loginInfo: LoginInfo) => {
        // send login request using loginInfo
        // if login success, set user and accessToken
    };

    const logout = () => {
        // send logout request
        // if logout success, reset user and accessToekn to null
    };

    // functions related to refresh token may be added later

    return (
        <SessionContext.Provider value={{ user, accessToken, login, logout }}>
            {children}
        </SessionContext.Provider>
    );
}

export default SessionProvider;
