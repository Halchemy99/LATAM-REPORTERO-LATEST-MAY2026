'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Globe, ChevronDown, Clock } from 'lucide-react';
import { useTranslation } from '@/lib/providers';

// Active languages (fully supported)
const ACTIVE_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', speakers: '1.5B+' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', speakers: '550M+' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', speakers: '260M+' },
];

// Indigenous languages (coming soon)
const INDIGENOUS_LANGUAGES = [
  { code: 'qu', name: 'Quechua', nativeName: 'Runasimi', speakers: '~10M', regions: 'Peru, Bolivia, Ecuador' },
  { code: 'ay', name: 'Aymara', nativeName: 'Aymar aru', speakers: '~2.5M', regions: 'Bolivia, Peru, Chile' },
  { code: 'gn', name: 'Guaraní', nativeName: 'Avañeʼẽ', speakers: '~6M', regions: 'Paraguay, Argentina, Bolivia, Brazil' },
  { code: 'nah', name: 'Nahuatl', nativeName: 'Nāhuatl', speakers: '~1.7M', regions: 'Mexico' },
  { code: 'yua', name: 'Yucatec Maya', nativeName: 'Màaya tʼàan', speakers: '~800K', regions: 'Mexico, Belize, Guatemala' },
  { code: 'arn', name: 'Mapudungun', nativeName: 'Mapudungun', speakers: '~250K', regions: 'Chile, Argentina' },
  { code: 'myn', name: 'Kʼicheʼ', nativeName: 'Kʼicheʼ', speakers: '~1M', regions: 'Guatemala' },
  { code: 'tzh', name: 'Tzeltal', nativeName: 'Batsʼil kʼop', speakers: '~500K', regions: 'Mexico (Chiapas)' },
];

export default function LanguageSelector({ variant = 'dropdown' }) {
  const { locale, setLocale } = useTranslation();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedIndigenous, setSelectedIndigenous] = useState(null);

  const currentLang = ACTIVE_LANGUAGES.find(l => l.code === locale) || ACTIVE_LANGUAGES[0];

  const handleLanguageSelect = (langCode) => {
    // All three languages now have translations
    setLocale(langCode);
  };

  const handleIndigenousSelect = (lang) => {
    setSelectedIndigenous(lang);
    setShowComingSoon(true);
  };

  if (variant === 'full') {
    return (
      <div className="space-y-6" data-testid="language-selector-full">
        {/* Active Languages */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Available Languages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ACTIVE_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  locale === lang.code 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                data-testid={`lang-${lang.code}`}
              >
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-sm text-muted-foreground">{lang.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{lang.speakers} speakers</div>
              </button>
            ))}
          </div>
        </div>

        {/* Indigenous Languages */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            Indigenous Languages
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full dark:bg-amber-900/30 dark:text-amber-300">
              Coming Soon
            </span>
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            We are committed to supporting indigenous languages across Latin America and Central America.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {INDIGENOUS_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleIndigenousSelect(lang)}
                className="p-4 rounded-lg border border-border hover:border-primary/50 text-left transition-all opacity-80 hover:opacity-100"
                data-testid={`lang-${lang.code}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-sm text-muted-foreground">{lang.name}</div>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {lang.speakers} speakers • {lang.regions}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Coming Soon Dialog */}
        <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {selectedIndigenous?.nativeName} — Coming Soon
              </DialogTitle>
              <DialogDescription className="pt-4 space-y-4">
                <p>
                  We are working to bring LATAM Reportero to speakers of <strong>{selectedIndigenous?.name}</strong>.
                </p>
                <p>
                  This language is spoken by approximately <strong>{selectedIndigenous?.speakers}</strong> people 
                  in {selectedIndigenous?.regions}.
                </p>
                <p className="text-muted-foreground">
                  Our commitment to linguistic diversity means supporting the languages that have shaped 
                  Latin America for thousands of years. Check back soon for updates.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium">Want to help?</p>
                  <p className="text-sm text-muted-foreground">
                    If you speak {selectedIndigenous?.name} and would like to contribute to translation 
                    efforts, please contact us at{' '}
                    <a href="mailto:languages@latamreportero.com" className="text-primary hover:underline">
                      languages@latamreportero.com
                    </a>
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Default dropdown variant
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2" data-testid="language-selector">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{currentLang.nativeName}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Languages</DropdownMenuLabel>
          
          {/* Active Languages */}
          {ACTIVE_LANGUAGES.map(lang => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={locale === lang.code ? 'bg-accent' : ''}
              data-testid={`lang-option-${lang.code}`}
            >
              <div className="flex justify-between w-full">
                <span>{lang.nativeName}</span>
                <span className="text-xs text-muted-foreground">{lang.speakers}</span>
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="flex items-center gap-2 text-xs">
            Indigenous Languages
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded dark:bg-amber-900/30 dark:text-amber-300">
              Soon
            </span>
          </DropdownMenuLabel>
          
          {/* Indigenous Languages (Coming Soon) */}
          {INDIGENOUS_LANGUAGES.slice(0, 4).map(lang => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleIndigenousSelect(lang)}
              className="opacity-70"
              data-testid={`lang-option-${lang.code}`}
            >
              <div className="flex justify-between w-full items-center">
                <span>{lang.nativeName}</span>
                <Clock className="h-3 w-3 text-muted-foreground" />
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuItem
            onClick={() => handleIndigenousSelect(INDIGENOUS_LANGUAGES[0])}
            className="text-xs text-muted-foreground"
          >
            View all languages →
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Coming Soon Dialog */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {selectedIndigenous?.nativeName} — Coming Soon
            </DialogTitle>
            <DialogDescription className="pt-4 space-y-4">
              <p>
                We are working to bring LATAM Reportero to speakers of <strong>{selectedIndigenous?.name}</strong>.
              </p>
              <p>
                This language is spoken by approximately <strong>{selectedIndigenous?.speakers}</strong> people.
              </p>
              <p className="text-muted-foreground">
                Check back soon for updates on this language.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Export language data for use elsewhere
export { ACTIVE_LANGUAGES, INDIGENOUS_LANGUAGES };
