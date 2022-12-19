import type { AppProps } from 'next/app';
import React from 'react';

import Header from '../components/Header';
import DateProvider from '../contexts/DateContext';
import SessionProvider from '../contexts/SessionContext';
import '../styles/global.css';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <SessionProvider>
                <DateProvider>
                    <Header />
                    <Component {...pageProps} />
                </DateProvider>
            </SessionProvider>
        </>
    );
}
