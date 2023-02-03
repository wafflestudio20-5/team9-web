import type { AppProps } from 'next/app';
import React, { PropsWithChildren } from 'react';

import Header from '@components/Header/Header';
import RouteGuard from '@components/RouteGuard';
import BoxSizeProvider from '@contexts/BoxSizeContext';
import CalendarProvider from '@contexts/CalendarContext';
import DateProvider from '@contexts/DateContext';
import ModalProvider, { ModalContainer } from '@contexts/ModalContext';
import SessionProvider from '@contexts/SessionContext';
import SidebarProvider from '@contexts/SidebarContext';
import ThemeProvider from '@contexts/ThemeContext';
import '@styles/global.scss';

function ContextProviders({ children }: PropsWithChildren) {
    return (
        <ThemeProvider>
            <SessionProvider>
                <CalendarProvider>
                    <DateProvider>
                        <ModalProvider>
                            <SidebarProvider>
                                <BoxSizeProvider>{children}</BoxSizeProvider>
                            </SidebarProvider>
                        </ModalProvider>
                    </DateProvider>
                </CalendarProvider>
            </SessionProvider>
        </ThemeProvider>
    );
}

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ContextProviders>
            <RouteGuard />
            <Header />
            <Component {...pageProps} />
            <ModalContainer />
        </ContextProviders>
    );
}
