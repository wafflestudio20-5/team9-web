import type { AppProps } from 'next/app';
import React from 'react';

import Header from '@components/Header/Header';
import DateProvider from '@contexts/DateContext';
import ModalProvider, { ModalContainer } from '@contexts/ModalContext';
import SessionProvider from '@contexts/SessionContext';
import SidebarProvider from '@contexts/SidebarContext';
import '@styles/global.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <SessionProvider>
                <DateProvider>
                    <ModalProvider>
                        <SidebarProvider>
                            <Header />
                            <Component {...pageProps} />
                            <ModalContainer />
                        </SidebarProvider>
                    </ModalProvider>
                </DateProvider>
            </SessionProvider>
        </>
    );
}
