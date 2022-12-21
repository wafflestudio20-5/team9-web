import type { AppProps } from 'next/app';
import React from 'react';

import Header from '../components/Header';
import ModalContainer from '../components/ModalContainer';
import DateProvider from '../contexts/DateContext';
import ModalProvider from '../contexts/ModalContext';
import SessionProvider from '../contexts/SessionContext';
import SidebarProvider from '../contexts/SidebarContext';
import '../styles/global.css';

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
