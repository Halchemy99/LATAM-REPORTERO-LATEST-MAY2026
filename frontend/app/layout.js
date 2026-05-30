import './globals.css';
import Script from 'next/script';
import { I18nProvider, UserRoleProvider, ContentModeProvider } from '@/lib/providers';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'LATAM Reportero. Latin America, Explained.',
  description: 'Explanatory, contextual journalism covering Latin America. Morning briefs, press reviews and original investigations. Free every weekday.',
  keywords: 'Latin America, journalism, news, explanatory journalism, Mexico, Brazil, Argentina, Chile, Colombia',
  icons: {
    icon: '/brand/logo-square.png',
    shortcut: '/brand/logo-square.png',
    apple: '/brand/logo-square.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'LATAM Reportero',
    title: 'LATAM Reportero. Latin America, Explained.',
    description: 'Explanatory, contextual journalism covering Latin America. Morning briefs, press reviews and original investigations. Free every weekday.',
    url: 'https://latamreportero.mx',
    images: [
      {
        url: 'https://latamreportero.mx/brand/logo-square.png',
        width: 500,
        height: 500,
        alt: 'LATAM Reportero',
      },
    ],
  },
  twitter: {
    card: 'summary',
    site: '@latamreportero',
    creator: '@latamreportero',
    title: 'LATAM Reportero. Latin America, Explained.',
    description: 'Explanatory, contextual journalism covering Latin America. Morning briefs, press reviews and original investigations. Free every weekday.',
    images: ['https://latamreportero.mx/brand/logo-square.png'],
  },
};

// Static error handler script - suppresses known DataCloneError from PerformanceServerTiming
const ERROR_HANDLER_SCRIPT = `window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="error-handler" strategy="beforeInteractive">
          {ERROR_HANDLER_SCRIPT}
        </Script>
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <I18nProvider>
          <UserRoleProvider>
            <ContentModeProvider>
              {children}
              <Toaster />
            </ContentModeProvider>
          </UserRoleProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
