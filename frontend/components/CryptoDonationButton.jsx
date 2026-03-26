'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Heart, Copy, Check, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Wallet addresses
const WALLETS = {
  ETH: {
    address: '0xb5CDD659a06a6c89a69a8427e1A962A1AbDfF5ca',
    name: 'Ethereum (ETH)',
    icon: '⟠',
    color: 'from-blue-500 to-purple-600',
    explorer: 'https://etherscan.io/address/'
  },
  BTC: {
    address: 'bc1qaw8j4t8593hmtt5y9uzs4fkl2fmuh5lue40m8v',
    name: 'Bitcoin (BTC)',
    icon: '₿',
    color: 'from-orange-500 to-yellow-500',
    explorer: 'https://www.blockchain.com/btc/address/'
  }
};

export default function CryptoDonationButton({ variant = 'default', className = '' }) {
  const [open, setOpen] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(null);
  const { toast } = useToast();

  const copyToClipboard = async (wallet, address) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedWallet(wallet);
      toast({
        title: 'Address Copied!',
        description: `${wallet} address copied to clipboard`,
      });
      setTimeout(() => setCopiedWallet(null), 2000);
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the address manually',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'icon' ? (
          <Button 
            variant="outline" 
            size="icon"
            className={`hover:bg-[#8c52ff]/10 hover:border-[#8c52ff] ${className}`}
            data-testid="crypto-donate-btn"
          >
            <Heart className="h-4 w-4 text-[#8c52ff]" />
          </Button>
        ) : (
          <Button 
            variant="outline"
            className={`gap-2 hover:bg-[#8c52ff]/10 hover:border-[#8c52ff] ${className}`}
            data-testid="crypto-donate-btn"
          >
            <Heart className="h-4 w-4 text-[#8c52ff]" />
            <span>Donate Crypto</span>
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-[#8c52ff]" />
            Support Independent Journalism
          </DialogTitle>
          <DialogDescription>
            Your crypto donation helps fund solutions-focused journalism across Latin America.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="ETH" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ETH" className="gap-2">
              <span className="text-lg">⟠</span> Ethereum
            </TabsTrigger>
            <TabsTrigger value="BTC" className="gap-2">
              <span className="text-lg">₿</span> Bitcoin
            </TabsTrigger>
          </TabsList>
          
          {Object.entries(WALLETS).map(([key, wallet]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className={`p-4 rounded-lg bg-gradient-to-r ${wallet.color} text-white`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{wallet.icon}</span>
                  <span className="font-semibold">{wallet.name}</span>
                </div>
                <p className="text-sm text-white/80">
                  Send any amount to support our mission
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Wallet Address</label>
                <div className="flex gap-2">
                  <Input 
                    value={wallet.address}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(key, wallet.address)}
                    className="flex-shrink-0"
                  >
                    {copiedWallet === key ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  View on explorer
                </span>
                <a 
                  href={`${wallet.explorer}${wallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#8c52ff] hover:underline"
                >
                  {key === 'ETH' ? 'Etherscan' : 'Blockchain.com'}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              
              <div className="bg-muted rounded-lg p-3 text-sm">
                <p className="font-medium mb-1">How your donation helps:</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Fund investigative journalism</li>
                  <li>• Support local reporters</li>
                  <li>• Keep content accessible</li>
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-4 pt-4 border-t text-center">
          <Badge variant="outline" className="text-xs">
            100% of donations go to journalism
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}
