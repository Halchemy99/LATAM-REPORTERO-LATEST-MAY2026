'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { Heart, Copy, Check, ExternalLink, Wallet, Loader2 } from 'lucide-react';

// Wallet addresses
const WALLETS = {
  ETH: {
    address: '0xb5CDD659a06a6c89a69a8427e1A962A1AbDfF5ca',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '⟠',
    color: 'from-[#627EEA] to-[#3B5998]',
    explorer: 'https://etherscan.io/address/'
  },
  BTC: {
    address: 'bc1qaw8j4t8593hmtt5y9uzs4fkl2fmuh5lue40m8v',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '₿',
    color: 'from-[#F7931A] to-[#E87D0D]',
    explorer: 'https://www.blockchain.com/btc/address/'
  }
};

export default function CryptoDonationButton({ variant = 'default', className = '' }) {
  const [open, setOpen] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [donationAmount, setDonationAmount] = useState('0.01');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== 'undefined' && window.ethereum;

  // Check wallet connection on mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (isMetaMaskInstalled) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setUserAddress(accounts[0]);
        }
      } catch (err) {
        console.error('Error checking wallet:', err);
      }
    }
  };

  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      setError('Please install MetaMask to donate with crypto');
      return;
    }

    try {
      setError('');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setWalletConnected(true);
        setUserAddress(accounts[0]);
      }
    } catch (err) {
      setError('Failed to connect wallet');
      console.error('Wallet connection error:', err);
    }
  };

  const sendDonation = async () => {
    if (!walletConnected || !userAddress) {
      setError('Please connect your wallet first');
      return;
    }

    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid donation amount');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');
    setTxHash('');

    try {
      // Import ethers dynamically
      const { ethers } = await import('ethers');
      
      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Convert amount to wei
      const amountInWei = ethers.parseEther(donationAmount);

      // Send transaction
      const tx = await signer.sendTransaction({
        to: WALLETS.ETH.address,
        value: amountInWei,
      });

      setTxHash(tx.hash);
      setSuccess('Transaction sent! Waiting for confirmation...');

      // Wait for confirmation
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        setSuccess('Thank you! Your donation has been confirmed.');
        setDonationAmount('0.01');
      } else {
        setError('Transaction failed. Please try again.');
      }
    } catch (err) {
      console.error('Donation error:', err);
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        setError('Transaction cancelled by user');
      } else {
        setError(err.message || 'Failed to send donation');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async (wallet, address) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedWallet(wallet);
      setTimeout(() => setCopiedWallet(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(38)}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'icon' ? (
          <Button 
            variant="ghost" 
            size="icon"
            className={`hover:bg-[#23103A]/5 rounded-none ${className}`}
            data-testid="crypto-donate-btn"
          >
            <Heart className="h-4 w-4 text-[#D35A3D]" />
          </Button>
        ) : (
          <Button 
            variant="outline"
            className={`gap-2 hover:bg-[#23103A]/5 border-[#23103A]/20 rounded-none ${className}`}
            data-testid="crypto-donate-btn"
          >
            <Heart className="h-4 w-4 text-[#D35A3D]" />
            <span>Donate Crypto</span>
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md rounded-none border-[#23103A]/15">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-xl">
            <Heart className="h-5 w-5 text-[#D35A3D]" />
            Support Independent Journalism
          </DialogTitle>
          <DialogDescription className="text-[#5C5566]">
            Your crypto donation helps fund solutions-focused journalism across Latin America.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="ETH" className="mt-4">
          <TabsList className="grid w-full grid-cols-2 rounded-none bg-[#23103A]/5">
            <TabsTrigger value="ETH" className="gap-2 rounded-none data-[state=active]:bg-[#23103A] data-[state=active]:text-white">
              <span className="text-lg">⟠</span> ETH
            </TabsTrigger>
            <TabsTrigger value="BTC" className="gap-2 rounded-none data-[state=active]:bg-[#23103A] data-[state=active]:text-white">
              <span className="text-lg">₿</span> BTC
            </TabsTrigger>
          </TabsList>
          
          {/* ETH Tab - With MetaMask Integration */}
          <TabsContent value="ETH" className="space-y-4">
            <div className={`p-4 bg-gradient-to-r ${WALLETS.ETH.color} text-white`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{WALLETS.ETH.icon}</span>
                <span className="font-semibold">{WALLETS.ETH.name}</span>
              </div>
              <p className="text-sm text-white/80">
                Connect MetaMask or copy address
              </p>
            </div>
            
            {/* Error/Success Messages */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
                {success}
              </div>
            )}
            {txHash && (
              <div className="p-3 bg-blue-50 border border-blue-200 text-sm">
                <p className="font-medium text-blue-700 mb-1">Transaction Hash:</p>
                <a 
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-blue-600 hover:underline break-all"
                >
                  {txHash}
                </a>
              </div>
            )}
            
            {/* MetaMask Connection */}
            {isMetaMaskInstalled ? (
              <div className="space-y-3">
                {walletConnected ? (
                  <>
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">Connected: {formatAddress(userAddress)}</span>
                      </div>
                      <Badge className="bg-green-600 text-white rounded-none text-xs">Connected</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#23103A]">Amount (ETH)</label>
                      <Input 
                        type="number"
                        step="0.001"
                        min="0.001"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="rounded-none border-[#23103A]/20"
                        placeholder="0.01"
                      />
                    </div>
                    
                    <Button 
                      onClick={sendDonation}
                      disabled={isProcessing}
                      className="w-full bg-[#D35A3D] hover:bg-[#B84A30] text-white rounded-none"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Heart className="h-4 w-4 mr-2" />
                          Donate {donationAmount} ETH
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={connectWallet}
                    className="w-full bg-[#23103A] hover:bg-[#160A26] text-white rounded-none"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect MetaMask
                  </Button>
                )}
              </div>
            ) : (
              <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                <p className="font-medium mb-1">MetaMask not detected</p>
                <a 
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D35A3D] hover:underline flex items-center gap-1"
                >
                  Install MetaMask <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            
            <div className="pt-3 border-t border-[#23103A]/10">
              <p className="text-xs text-[#5C5566] mb-2">Or copy address manually:</p>
              <div className="flex gap-2">
                <Input 
                  value={WALLETS.ETH.address}
                  readOnly
                  className="font-mono text-xs rounded-none border-[#23103A]/20"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard('ETH', WALLETS.ETH.address)}
                  className="flex-shrink-0 rounded-none border-[#23103A]/20"
                >
                  {copiedWallet === 'ETH' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* BTC Tab - Copy Address Only */}
          <TabsContent value="BTC" className="space-y-4">
            <div className={`p-4 bg-gradient-to-r ${WALLETS.BTC.color} text-white`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{WALLETS.BTC.icon}</span>
                <span className="font-semibold">{WALLETS.BTC.name}</span>
              </div>
              <p className="text-sm text-white/80">
                Send any amount to support our mission
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#23103A]">BTC Wallet Address</label>
              <div className="flex gap-2">
                <Input 
                  value={WALLETS.BTC.address}
                  readOnly
                  className="font-mono text-xs rounded-none border-[#23103A]/20"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard('BTC', WALLETS.BTC.address)}
                  className="flex-shrink-0 rounded-none border-[#23103A]/20"
                >
                  {copiedWallet === 'BTC' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <a 
              href={`${WALLETS.BTC.explorer}${WALLETS.BTC.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-[#D35A3D] hover:underline"
            >
              View on Blockchain.com <ExternalLink className="h-3 w-3" />
            </a>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 pt-4 border-t border-[#23103A]/10 text-center">
          <Badge variant="outline" className="text-xs font-mono rounded-none border-[#23103A]/20 text-[#5C5566]">
            100% goes to journalism
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}
