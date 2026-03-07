import './globals.css';
import { I18nProvider, UserRoleProvider, ContentModeProvider } from '@/lib/providers';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'LATAM Reportero - Solutions-Oriented Journalism',
  description: 'Solutions-oriented journalism covering Latin America. Every story follows Problem → Solutions → Impact.',
  keywords: 'Latin America, journalism, news, solutions journalism, Mexico, Brazil, Argentina, Chile, Colombia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
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
