'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Wallet, ExternalLink, CheckCircle, AlertCircle, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Supported cryptocurrencies
const SUPPORTED_CRYPTOS = [
  { 
    id: 'eth', 
    name: 'Ethereum', 
    symbol: 'ETH', 
    icon: '⟠',
    color: 'bg-blue-500',
    decimals: 18
  },
  { 
    id: 'btc', 
    name: 'Bitcoin', 
    symbol: 'BTC', 
    icon: '₿',
    color: 'bg-orange-500',
    note: 'Send to wallet address'
  },
  { 
    id: 'usdc', 
    name: 'USD Coin', 
    symbol: 'USDC', 
    icon: '$',
    color: 'bg-blue-600',
    decimals: 6
  },
  { 
    id: 'ada', 
    name: 'Cardano', 
    symbol: 'ADA', 
    icon: '◈',
    color: 'bg-blue-400',
    note: 'Send to wallet address'
  },
];

// Wallet addresses for donations (replace with real addresses)
const WALLET_ADDRESSES = {
  eth: '0x742d35Cc6634C0532925a3b844Bc9e7595f7eE01',
  btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  usdc: '0x742d35Cc6634C0532925a3b844Bc9e7595f7eE01', // Same as ETH for ERC-20
  ada: 'addr1qxyz123...', // Cardano address
};

/**
 * CryptoDonation - MetaMask integration for crypto donations
 */
export default function CryptoDonation({ variant = 'button' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(SUPPORTED_CRYPTOS[0]);
  const [amount, setAmount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [txStatus, setTxStatus] = useState('idle'); // idle, pending, success, error

  // Check if MetaMask is installed
  const hasMetaMask = typeof window !== 'undefined' && window.ethereum;

  // Check wallet connection on mount
  useEffect(() => {
    if (hasMetaMask) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
          }
        })
        .catch(console.error);
    }
  }, [hasMetaMask]);

  const connectWallet = async () => {
    if (!hasMetaMask) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setWalletAddress(accounts[0]);
      setIsConnected(true);
      toast.success('Wallet connected!');
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const sendDonation = async () => {
    if (!isConnected || !amount) return;

    // For non-ETH tokens, show manual transfer instructions
    if (selectedCrypto.id === 'btc' || selectedCrypto.id === 'ada') {
      toast.info(`Please send ${amount} ${selectedCrypto.symbol} to the wallet address shown`);
      return;
    }

    setTxStatus('pending');
    try {
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, selectedCrypto.decimals || 18)));
      
      const txParams = {
        from: walletAddress,
        to: WALLET_ADDRESSES.eth,
        value: '0x' + amountInWei.toString(16),
      };

      const hash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });

      setTxHash(hash);
      setTxStatus('success');
      toast.success('Thank you for your donation!');
    } catch (error) {
      console.error('Transaction error:', error);
      setTxStatus('error');
      toast.error(error.message || 'Transaction failed');
    }
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard');
  };

  // Button variant - just a trigger
  if (variant === 'button') {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2" data-testid="crypto-donate-btn">
            <Wallet className="h-4 w-4" />
            Donate Crypto
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <CryptoDonationContent
            selectedCrypto={selectedCrypto}
            setSelectedCrypto={setSelectedCrypto}
            amount={amount}
            setAmount={setAmount}
            isConnected={isConnected}
            isConnecting={isConnecting}
            walletAddress={walletAddress}
            connectWallet={connectWallet}
            sendDonation={sendDonation}
            txStatus={txStatus}
            txHash={txHash}
            copyAddress={copyAddress}
            hasMetaMask={hasMetaMask}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Card variant - embedded in page
  return (
    <Card className="border-2" data-testid="crypto-donate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Support Independent Journalism
        </CardTitle>
        <CardDescription>
          Donate cryptocurrency to support our mission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CryptoDonationContent
          selectedCrypto={selectedCrypto}
          setSelectedCrypto={setSelectedCrypto}
          amount={amount}
          setAmount={setAmount}
          isConnected={isConnected}
          isConnecting={isConnecting}
          walletAddress={walletAddress}
          connectWallet={connectWallet}
          sendDonation={sendDonation}
          txStatus={txStatus}
          txHash={txHash}
          copyAddress={copyAddress}
          hasMetaMask={hasMetaMask}
        />
      </CardContent>
    </Card>
  );
}

// Inner content component
function CryptoDonationContent({
  selectedCrypto,
  setSelectedCrypto,
  amount,
  setAmount,
  isConnected,
  isConnecting,
  walletAddress,
  connectWallet,
  sendDonation,
  txStatus,
  txHash,
  copyAddress,
  hasMetaMask
}) {
  // Success state
  if (txStatus === 'success') {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Thank You!</h3>
          <p className="text-muted-foreground">Your donation has been sent</p>
        </div>
        {txHash && (
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
          >
            View transaction
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Crypto Selection */}
      <div className="space-y-2">
        <Label>Select Cryptocurrency</Label>
        <div className="grid grid-cols-2 gap-2">
          {SUPPORTED_CRYPTOS.map((crypto) => (
            <button
              key={crypto.id}
              onClick={() => setSelectedCrypto(crypto)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedCrypto.id === crypto.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              data-testid={`crypto-${crypto.id}`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-full ${crypto.color} text-white flex items-center justify-center text-lg`}>
                  {crypto.icon}
                </span>
                <div>
                  <div className="font-medium text-sm">{crypto.symbol}</div>
                  <div className="text-xs text-muted-foreground">{crypto.name}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount ({selectedCrypto.symbol})</Label>
        <div className="flex gap-2">
          <Input
            id="amount"
            type="number"
            step="0.001"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            data-testid="crypto-amount"
          />
          <div className="flex gap-1">
            {['0.01', '0.05', '0.1'].map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => setAmount(preset)}
                className="text-xs"
              >
                {preset}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Wallet Address for manual transfer */}
      {(selectedCrypto.id === 'btc' || selectedCrypto.id === 'ada') && (
        <div className="space-y-2">
          <Label>Send to this address</Label>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <code className="text-xs flex-1 break-all">
              {WALLET_ADDRESSES[selectedCrypto.id]}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyAddress(WALLET_ADDRESSES[selectedCrypto.id])}
              data-testid="copy-address"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Send your {selectedCrypto.symbol} donation to this address
          </p>
        </div>
      )}

      {/* MetaMask Connection */}
      {(selectedCrypto.id === 'eth' || selectedCrypto.id === 'usdc') && (
        <>
          {!isConnected ? (
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full"
              data-testid="connect-wallet"
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4 mr-2" />
              )}
              {hasMetaMask ? 'Connect MetaMask' : 'Install MetaMask'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
              </div>
              
              <Button
                onClick={sendDonation}
                disabled={!amount || txStatus === 'pending'}
                className="w-full"
                data-testid="send-donation"
              >
                {txStatus === 'pending' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Send {amount || '0'} {selectedCrypto.symbol}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Error state */}
      {txStatus === 'error' && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Transaction failed. Please try again.</span>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground">
        Cryptocurrency donations support independent journalism at LATAM Reportero. 
        Donations are not tax-deductible.
      </p>
    </div>
  );
}
