"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrendingUp, Lock, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";

interface RFB {
  id: string;
  bankName: string;
  isin: string;
  bondType: string;
  notionalAmount: string;
  maturity: string;
  rfbId: string;
  createdAt: string;
  status: string;
  bidsReceived: number;
}

export default function OpenBidsPage() {
  const { toast } = useToast();
  const [openRfbs, setOpenRfbs] = useState<RFB[]>([]);
  const [selectedRfb, setSelectedRfb] = useState<RFB | null>(null);
  const [bidData, setBidData] = useState({
    bankName: "",
    quotePrice: "",
    yield: "",
  });

  useEffect(() => {
    // Load RFBs from localStorage
    const rfbs = JSON.parse(localStorage.getItem("rfbs") || "[]");
    setOpenRfbs(rfbs.filter((rfb: RFB) => rfb.status === "open"));
  }, []);

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRfb) return;

    // Create bid
    const newBid = {
      ...bidData,
      rfbId: selectedRfb.id,
      timestamp: new Date().toISOString(),
    };

    // Store bid
    const existingBids = JSON.parse(localStorage.getItem("bids") || "[]");
    localStorage.setItem("bids", JSON.stringify([...existingBids, newBid]));

    // Update RFB
    const rfbs = JSON.parse(localStorage.getItem("rfbs") || "[]");
    const updatedRfbs = rfbs.map((rfb: RFB) => {
      if (rfb.id === selectedRfb.id) {
        const newBidsCount = rfb.bidsReceived + 1;
        return {
          ...rfb,
          bidsReceived: newBidsCount,
          status: newBidsCount >= 3 ? "closed" : "open",
        };
      }
      return rfb;
    });

    localStorage.setItem("rfbs", JSON.stringify(updatedRfbs));

    toast({
      title: "Bid Submitted Successfully",
      description: "Your quote has been encrypted and submitted via ZKP",
    });

    // Reset form and refresh
    setBidData({ bankName: "", quotePrice: "", yield: "" });
    setSelectedRfb(null);
    setOpenRfbs(updatedRfbs.filter((rfb: RFB) => rfb.status === "open"));
  };

  const getBondTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      vanilla: "Vanilla",
      callable: "Callable",
      frn: "FRN",
      stepup: "Step Up",
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="size-8" />
            <h1 className="text-xl font-semibold">BondBid ZKP</h1>
          </div>
          <nav className="flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/create" className="text-sm font-medium hover:text-primary">
              Create RFB
            </Link>
            <Link href="/open-bids" className="text-sm font-medium text-primary">
              Open Bids
            </Link>
            <Link href="/closed-bids" className="text-sm font-medium hover:text-primary">
              Closed Bids
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Open Bids</h2>
          <p className="text-muted-foreground">
            Select an open RFB to participate and submit your quote
          </p>
        </div>

        {openRfbs.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <TrendingUp className="size-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Open Bids</h3>
              <p className="text-sm text-muted-foreground mb-6">
                There are currently no open Request for Bids. Create one to get started.
              </p>
              <Link href="/create">
                <Button>Create New RFB</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openRfbs.map((rfb) => (
              <Card key={rfb.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-lg">{rfb.rfbId}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {rfb.bankName}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {rfb.bidsReceived}/3
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ISIN:</span>
                      <span className="font-mono">{rfb.isin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-semibold">{getBondTypeLabel(rfb.bondType)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-semibold">
                        ${parseInt(rfb.notionalAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Maturity:</span>
                      <span>{new Date(rfb.maturity).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded p-2">
                    <Lock className="size-3" />
                    <span>ZKP Protected</span>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full font-semibold" 
                        onClick={() => setSelectedRfb(rfb)}
                      >
                        Submit Quote
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Your Quote</DialogTitle>
                        <DialogDescription>
                          Your bid will be encrypted using Zero-Knowledge Proof technology
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitBid} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Your Bank Name</Label>
                          <Input
                            id="bankName"
                            placeholder="Enter bank name"
                            value={bidData.bankName}
                            onChange={(e) => setBidData({ ...bidData, bankName: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quotePrice">Quote Price (USD)</Label>
                          <Input
                            id="quotePrice"
                            type="number"
                            step="0.01"
                            placeholder="e.g., 99.50"
                            value={bidData.quotePrice}
                            onChange={(e) => setBidData({ ...bidData, quotePrice: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="yield">Yield (%)</Label>
                          <Input
                            id="yield"
                            type="number"
                            step="0.01"
                            placeholder="e.g., 4.25"
                            value={bidData.yield}
                            onChange={(e) => setBidData({ ...bidData, yield: e.target.value })}
                            required
                          />
                        </div>

                        <div className="bg-muted/50 border border-border rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <Lock className="size-4 text-secondary mt-0.5" />
                            <p className="text-xs text-muted-foreground">
                              Your quote will remain confidential until all 3 bids are received
                            </p>
                          </div>
                        </div>

                        <Button type="submit" className="w-full font-semibold">
                          Submit Encrypted Bid
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
