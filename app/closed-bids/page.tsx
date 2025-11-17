"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Trophy, TrendingDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

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

interface Bid {
  bankName: string;
  quotePrice: string;
  yield: string;
  rfbId: string;
  timestamp: string;
}

export default function ClosedBidsPage() {
  const [closedRfbs, setClosedRfbs] = useState<RFB[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [selectedRfb, setSelectedRfb] = useState<string | null>(null);

  useEffect(() => {
    const rfbs = JSON.parse(localStorage.getItem("rfbs") || "[]");
    const allBids = JSON.parse(localStorage.getItem("bids") || "[]");
    
    setClosedRfbs(rfbs.filter((rfb: RFB) => rfb.status === "closed"));
    setBids(allBids);
  }, []);

  const getBidsForRfb = (rfbId: string) => {
    return bids.filter((bid) => bid.rfbId === rfbId);
  };

  const getWinningBid = (rfbId: string) => {
    const rfbBids = getBidsForRfb(rfbId);
    if (rfbBids.length === 0) return null;
    
    return rfbBids.reduce((min, bid) => 
      parseFloat(bid.quotePrice) < parseFloat(min.quotePrice) ? bid : min
    );
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
            <div className="size-8 bg-primary rounded" />
            <h1 className="text-xl font-semibold">BondBid ZKP</h1>
          </div>
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
            <Link href="/closed-bids" className="text-sm font-medium text-primary">
              Closed Bids
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Closed Bids</h2>
          <p className="text-muted-foreground">
            View completed RFBs and winning bids with full transparency
          </p>
        </div>

        {closedRfbs.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <CheckCircle className="size-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Closed Bids Yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Closed bids will appear here once they receive all 3 quotes
              </p>
              <Link href="/open-bids">
                <Button>View Open Bids</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {closedRfbs.map((rfb) => {
              const rfbBids = getBidsForRfb(rfb.id);
              const winningBid = getWinningBid(rfb.id);

              return (
                <Card key={rfb.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          {rfb.rfbId}
                          <Badge variant="outline" className="ml-2">
                            <CheckCircle className="size-3 mr-1" />
                            Closed
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-2">
                          Issued by {rfb.bankName} • ISIN: {rfb.isin}
                        </CardDescription>
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground">
                        {getBondTypeLabel(rfb.bondType)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div>
                        <p className="text-xs text-muted-foreground">Notional Amount</p>
                        <p className="text-sm font-semibold mt-1">
                          ${parseInt(rfb.notionalAmount).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Maturity Date</p>
                        <p className="text-sm font-semibold mt-1">
                          {new Date(rfb.maturity).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Bids Received</p>
                        <p className="text-sm font-semibold mt-1">{rfbBids.length} Quotes</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="text-sm font-semibold mt-1 text-secondary">Completed</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Trophy className="size-5 text-secondary" />
                        <h3 className="font-semibold">Winning Bid</h3>
                      </div>
                      
                      {winningBid && (
                        <div className="bg-secondary/5 border-2 border-secondary/20 rounded-lg p-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Winner</p>
                              <p className="text-lg font-bold mt-1">{winningBid.bankName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Quote Price</p>
                              <p className="text-lg font-bold mt-1 text-secondary">
                                ${parseFloat(winningBid.quotePrice).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Yield</p>
                              <p className="text-lg font-bold mt-1">
                                {parseFloat(winningBid.yield).toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingDown className="size-4" />
                        All Submitted Bids
                      </h3>
                      <div className="space-y-3">
                        {rfbBids
                          .sort((a, b) => parseFloat(a.quotePrice) - parseFloat(b.quotePrice))
                          .map((bid, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-4 rounded-lg border ${
                                bid === winningBid
                                  ? "bg-secondary/5 border-secondary/20"
                                  : "bg-card border-border"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center size-8 rounded-full bg-muted text-sm font-semibold">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-semibold">{bid.bankName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(bid.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">Price</p>
                                  <p className="font-bold">${parseFloat(bid.quotePrice).toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">Yield</p>
                                  <p className="font-semibold">{parseFloat(bid.yield).toFixed(2)}%</p>
                                </div>
                                {bid === winningBid && (
                                  <Trophy className="size-5 text-secondary" />
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
