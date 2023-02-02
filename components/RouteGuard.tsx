import { useRouter } from 'next/router';
import React, { useState, useEffect, PropsWithChildren } from 'react';

import { useSessionContext } from '@contexts/SessionContext';

export default function RouteGuard({ children }: PropsWithChildren) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const { user } = useSessionContext();

    useEffect(() => {
        // on initial load - run auth check
        authCheck(router.asPath);

        // on route change start - hide page content by setting authorized to false
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check
        router.events.on('routeChangeComplete', authCheck);

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function authCheck(url: string) {
        // redirect to login page if accessing a private page and not logged in
        if (user === null) {
            setAuthorized(false);
            router.push({
                pathname: '/login',
            });
        } else {
            setAuthorized(true);
        }
    }

    return <>{children}</>;
}
