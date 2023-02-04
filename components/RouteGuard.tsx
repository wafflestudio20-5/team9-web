import { useRouter } from 'next/router';
import React, { useState, useEffect, PropsWithChildren } from 'react';

import { useSessionContext } from '@contexts/SessionContext';

export default function RouteGuard({ children }: PropsWithChildren) {
    const router = useRouter();
    const { user } = useSessionContext();
    const [pathName, setPathName] = useState(router.pathname);

    useEffect(() => {
        if (user === null) {
            router.push({
                pathname: '/login',
            });
        } else {
            if (router.pathname === '/login') {
                router.push('/');
            } else {
                router.push({
                    pathname: pathName,
                });
            }
        }
    }, [user]);

    return <></>;
}
