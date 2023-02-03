import { useRouter } from 'next/router';
import React, { useState, useEffect, PropsWithChildren } from 'react';

import { useSessionContext } from '@contexts/SessionContext';

export default function RouteGuard({ children }: PropsWithChildren) {
    const router = useRouter();
    const { user } = useSessionContext();

    useEffect(() => {
        if (user === null) {
            router.push({
                pathname: '/login',
            });
        } else {
            router.back();
        }
    }, [user]);

    return <></>;
}
