"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, CheckCircle, Wallet } from 'lucide-react';
import { Logo } from "@/components/logo";
import { useState } from "react";
import { WalletCard } from "@/components/ui/wallet";

export default function HomePage() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  /*const handleConnect = () => {
    setIsConnected(true);
    setWalletAddress("0x1234567890abcdef");
  };*/

  const handleConnect = async () => {
    let isConnected = false;
    let address = null;
    try {
      // To authorize a DApp, call the enable() method and wait for 
      // the user to respond to the request.
      const connectorAPI = await window.midnight?.mnLace.enable();
      console.log("connectorAPI", connectorAPI);
      // Let's now check if the DApp is authorized, using the isEnabled() method
      const isEnabled = await window.midnight?.mnLace.isEnabled();
      if (isEnabled) {
        isConnected = true;
        console.log("Connected to the wallet:", connectorAPI);
  
        // To get the wallet state, we call the state() API method, that will
        // return the DAppConnectorWalletState object, which is where we can get 
        // the wallet address from.
        const state = await connectorAPI.state();
        address = state.address;
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  
    setIsConnected(isConnected);
    setWalletAddress(address);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="size-8" />
            <h1 className="text-xl font-semibold">BondBid ZKP</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex gap-6">
              <Link href="/" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
              <Link href="/create" className="text-sm font-medium hover:text-primary">
                Create RFB
              </Link>
              <Link href="/open-bids" className="text-sm font-medium hover:text-primary">
                Open Bids
              </Link>
              <Link href="/closed-bids" className="text-sm font-medium hover:text-primary">
                Closed Bids
              </Link>
            </nav>
            <WalletCard
                isConnected={isConnected}
                walletAddress={walletAddress}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">
            <span className="size-2 bg-secondary rounded-full animate-pulse" />
            Powered by Zero-Knowledge Proofs
          </div>

          <h2 className="text-5xl font-bold tracking-tight text-balance">
            Secure Bond Trading with Privacy-Preserving Technology
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Create and participate in Request for Bids for Vanilla and Exotic Bonds. 
            Our ZKP technology ensures bid confidentiality while maintaining transparency.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Link href="/create">
              <Button size="lg" className="font-semibold">
                Create New RFB
              </Button>
            </Link>
            <Link href="/open-bids">
              <Button size="lg" variant="outline" className="font-semibold">
                View Open Bids
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <div className="bg-card border border-border rounded-lg p-6 text-left">
              <div className="size-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="size-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Create RFB</h3>
              <p className="text-sm text-muted-foreground">
                Initiate Request for Bids for Vanilla, Callable, FRN, and Step Up bonds using ISIN identifiers.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-left">
              <div className="size-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="size-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Submit Quotes</h3>
              <p className="text-sm text-muted-foreground">
                Banks participate in open bids by submitting competitive quotes secured with ZKP encryption.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-left">
              <div className="size-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="size-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Winner Selection</h3>
              <p className="text-sm text-muted-foreground">
                After 3 bids, the system automatically selects the best quote while maintaining participant privacy.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 BondBid ZKP. Secure blockchain-based bond trading platform.</p>
        </div>
      </footer>
    </div>
  );
}
