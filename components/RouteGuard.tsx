import { useRouter } from 'next/router';
import React, { useState, useEffect, PropsWithChildren } from 'react';

import { useSessionContext } from '@contexts/SessionContext';

export default function RouteGuard({ children }: PropsWithChildren) {
    const router = useRouter();
    const { user } = useSessionContext();
    const [pathName, setPathName] = useState(router.pathname);

    useEffect(() => {
        if (user === null && pathName !== '/login') {
            router.push({
                pathname: '/',
            });
        } else {
            router.push({
                pathname: pathName,
            });
        }
    }, [user]);

    return <></>;
}
