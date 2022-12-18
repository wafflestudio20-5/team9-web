import React from 'react';
import Header from '../components/Header';
import type { AppProps } from 'next/app';
import '../styles/global.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}
