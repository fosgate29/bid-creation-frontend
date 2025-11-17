"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function CreateRFBPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    bankName: "",
    isin: "",
    bondType: "",
    notionalAmount: "",
    maturity: "",
    rfbId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate creating RFB
    const newRfb = {
      ...formData,
      id: `RFB-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "open",
      bidsReceived: 0,
    };

    // Store in localStorage for demo
    const existingRfbs = JSON.parse(localStorage.getItem("rfbs") || "[]");
    localStorage.setItem("rfbs", JSON.stringify([...existingRfbs, newRfb]));

    toast({
      title: "RFB Created Successfully",
      description: `RFB ID: ${newRfb.id} is now open for bidding`,
    });

    setTimeout(() => {
      router.push("/open-bids");
    }, 1500);
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
            <Link href="/create" className="text-sm font-medium text-primary">
              Create RFB
            </Link>
            <Link href="/open-bids" className="text-sm font-medium hover:text-primary">
              Open Bids
            </Link>
            <Link href="/closed-bids" className="text-sm font-medium hover:text-primary">
              Closed Bids
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Shield className="size-5 text-secondary" />
              </div>
              <div>
                <CardTitle>Create Request for Bid</CardTitle>
                <CardDescription>
                  Initiate a new bond RFB secured with Zero-Knowledge Proof technology
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="Enter your bank name"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rfbId">RFB Identifier</Label>
                  <Input
                    id="rfbId"
                    placeholder="e.g., RFB-2025-001"
                    value={formData.rfbId}
                    onChange={(e) => setFormData({ ...formData, rfbId: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isin">ISIN Code</Label>
                <Input
                  id="isin"
                  placeholder="e.g., US912828XY45"
                  value={formData.isin}
                  onChange={(e) => setFormData({ ...formData, isin: e.target.value })}
                  required
                  maxLength={12}
                />
                <p className="text-xs text-muted-foreground">12-character alphanumeric code</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bondType">Bond Type</Label>
                <Select value={formData.bondType} onValueChange={(value) => setFormData({ ...formData, bondType: value })}>
                  <SelectTrigger id="bondType">
                    <SelectValue placeholder="Select bond type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vanilla">Vanilla Bond</SelectItem>
                    <SelectItem value="callable">Callable Bond</SelectItem>
                    <SelectItem value="frn">Floating Rate Note (FRN)</SelectItem>
                    <SelectItem value="stepup">Step Up Bond</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="notionalAmount">Notional Amount (USD)</Label>
                  <Input
                    id="notionalAmount"
                    type="number"
                    placeholder="e.g., 1000000"
                    value={formData.notionalAmount}
                    onChange={(e) => setFormData({ ...formData, notionalAmount: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maturity">Maturity Date</Label>
                  <Input
                    id="maturity"
                    type="date"
                    value={formData.maturity}
                    onChange={(e) => setFormData({ ...formData, maturity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="size-5 text-secondary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Zero-Knowledge Proof Protection</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All bid quotes will be encrypted using ZKP technology, ensuring complete confidentiality 
                      until all 3 bids are received.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 font-semibold">
                  Create RFB
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/")} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
