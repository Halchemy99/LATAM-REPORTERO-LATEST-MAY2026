'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Bot, User, Lock, Crown, Eye } from 'lucide-react';

// Content Mode Context
const ContentModeContext = createContext({
  mode: 'ai', // 'ai' | 'human'
  setMode: () => {},
  canViewHuman: false,
  viewAs: 'guest', // 'guest' | 'free' | 'subscriber' | 'editor' | 'admin'
});

export const useContentMode = () => useContext(ContentModeContext);

export function ContentModeProvider({ children, isSubscribed, userRole }) {
  const [mode, setMode] = useState('ai');
  const [showPaywall, setShowPaywall] = useState(false);
  
  // Determine what the user can view
  const canViewHuman = isSubscribed || ['editor', 'admin', 'contributor'].includes(userRole);
  
  // Determine view perspective
  const viewAs = !userRole ? 'guest' : 
                 isSubscribed ? 'subscriber' :
                 ['admin', 'editor'].includes(userRole) ? userRole : 'free';
  
  const handleModeChange = (newMode) => {
    if (newMode === 'human' && !canViewHuman) {
      setShowPaywall(true);
      return;
    }
    setMode(newMode);
  };
  
  return (
    <ContentModeContext.Provider value={{ mode, setMode: handleModeChange, canViewHuman, viewAs }}>
      {children}
      <PaywallDialog open={showPaywall} onOpenChange={setShowPaywall} />
    </ContentModeContext.Provider>
  );
}

function PaywallDialog({ open, onOpenChange }) {
  const router = useRouter();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#8c52ff]" />
            Human-Written Content
          </DialogTitle>
          <DialogDescription>
            Access to human-written articles requires a subscription.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              Subscriber Benefits
            </h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Access to all human-written articles
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Exclusive investigative journalism
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Support independent LATAM journalism
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Ad-free experience
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => {
                onOpenChange(false);
                router.push('/pricing');
              }}
              className="w-full bg-gradient-to-r from-[#8c52ff] to-[#6111ff]"
            >
              View Subscription Plans
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Continue with AI Articles
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ContentModeToggle({ isSubscribed, userRole }) {
  const [mode, setMode] = useState('ai');
  const [showPaywall, setShowPaywall] = useState(false);
  const router = useRouter();
  
  // Determine permissions
  const canViewHuman = isSubscribed || ['editor', 'admin', 'contributor'].includes(userRole);
  const isStaff = ['editor', 'admin'].includes(userRole);
  
  // Determine view label
  const getViewLabel = () => {
    if (!userRole) return 'Guest';
    if (isSubscribed) return 'Subscriber';
    if (userRole === 'admin') return 'Admin';
    if (userRole === 'editor') return 'Editor';
    return 'Free';
  };
  
  const handleToggle = (newMode) => {
    if (newMode === 'human' && !canViewHuman) {
      setShowPaywall(true);
      return;
    }
    setMode(newMode);
    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('contentMode', newMode);
      // Dispatch event for other components to listen
      window.dispatchEvent(new CustomEvent('contentModeChange', { detail: { mode: newMode } }));
    }
  };
  
  // Load saved preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contentMode');
      if (saved && (saved === 'ai' || (saved === 'human' && canViewHuman))) {
        setMode(saved);
      }
    }
  }, [canViewHuman]);
  
  return (
    <>
      <TooltipProvider>
        <div className="flex items-center gap-1 bg-muted rounded-full p-1">
          {/* AI Mode Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === 'ai' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleToggle('ai')}
                className={`rounded-full px-3 h-8 ${
                  mode === 'ai' 
                    ? 'bg-gradient-to-r from-[#8c52ff] to-[#6111ff] text-white' 
                    : 'hover:bg-background'
                }`}
                data-testid="content-mode-ai"
              >
                <Bot className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline text-xs">AI</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI-Generated Articles (Free)</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Human Mode Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === 'human' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleToggle('human')}
                className={`rounded-full px-3 h-8 relative ${
                  mode === 'human' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                    : 'hover:bg-background'
                }`}
                data-testid="content-mode-human"
              >
                <User className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline text-xs">Human</span>
                {!canViewHuman && (
                  <Lock className="h-3 w-3 absolute -top-1 -right-1 text-yellow-500" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {canViewHuman 
                  ? 'Human-Written Articles' 
                  : 'Human Articles (Subscribers Only)'}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* View Mode Indicator for Staff */}
        {isStaff && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className="ml-2 text-xs border-[#8c52ff]/30 text-[#8c52ff]"
              >
                <Eye className="h-3 w-3 mr-1" />
                {getViewLabel()}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Current view perspective</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
      
      <PaywallDialog open={showPaywall} onOpenChange={setShowPaywall} />
    </>
  );
}

// Export a hook to get the current content mode
export function useCurrentContentMode() {
  const [mode, setMode] = useState('ai');
  
  useEffect(() => {
    // Load initial value
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contentMode') || 'ai';
      setMode(saved);
      
      // Listen for changes
      const handleChange = (e) => setMode(e.detail.mode);
      window.addEventListener('contentModeChange', handleChange);
      return () => window.removeEventListener('contentModeChange', handleChange);
    }
  }, []);
  
  return mode;
}
