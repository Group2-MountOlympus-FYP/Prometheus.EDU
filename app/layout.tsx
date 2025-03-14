import '@mantine/core/styles.css';

import {ColorSchemeScript, MantineProvider} from '@mantine/core';
import {theme} from '../theme';
import Header from '@/components/HeaderMenu/Header';
import { FooterSimple } from '@/components/FooterSimple/FooterSimple';

export const metadata = {
    title: 'Prometheus.EDU',
    description: 'A Comprehensive Online Education Platform',
};

export default function RootLayout({children}: { children: any }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <ColorSchemeScript/>
            <link rel="shortcut icon" href="/carbon-ella-logo.png"/>
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
        </head>
        <body>
        <MantineProvider theme={theme}>
            <Header/>
            {children}
            <FooterSimple/>
        </MantineProvider>
        </body>
        </html>
    );
}

