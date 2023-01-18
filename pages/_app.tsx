import type { AppProps } from 'next/app';
import React from 'react';

import Header from '@components/Header/Header';
import CalendarProvider from '@contexts/CalendarContext';
import DateProvider from '@contexts/DateContext';
import ModalProvider, { ModalContainer } from '@contexts/ModalContext';
import SessionProvider from '@contexts/SessionContext';
import SidebarProvider from '@contexts/SidebarContext';
import ThemeProvider from '@contexts/ThemeContext';
import '@styles/global.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <ThemeProvider>
                <SessionProvider>
                    <CalendarProvider>
                        <DateProvider>
                            <ModalProvider>
                                <SidebarProvider>
                                    <Header />
                                    <Component {...pageProps} />
                                    <ModalContainer />
                                </SidebarProvider>
                            </ModalProvider>
                        </DateProvider>
                    </CalendarProvider>
                </SessionProvider>
            </ThemeProvider>
        </>
    );
}
