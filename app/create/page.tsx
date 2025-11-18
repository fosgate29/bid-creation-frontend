"use client";

import { useState, useEffect } from "react";
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
import { Logo } from "@/components/logo";

interface Bond {
  "ISIN / ISIN RegS": string;
  "Issue name (eng)": string;
  "Maturity date": string | null;
  "Issue amount": number;
  [key: string]: any;
}

export default function CreateRFBPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [formData, setFormData] = useState({
    bankName: "",
    isin: "",
    bondType: "vanilla",
    notionalAmount: "",
    maturity: "",
    rfbId: "",
  });

  useEffect(() => {
    // Load bonds from JSON file
    fetch("/bonds_eng.json")
      .then((res) => res.json())
      .then((data) => {
        setBonds(data);
      })
      .catch((error) => {
        console.error("Error loading bonds:", error);
        toast({
          title: "Error",
          description: "Failed to load bonds data",
          variant: "destructive",
        });
      });
  }, [toast]);

  const generateRfbId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
    const randomLetters = Math.random().toString(36).substring(2, 5).toUpperCase();
    const rfbId = `RFB-${year}-${randomLetters}${randomNum}`;
    
    return rfbId;
  };

  const convertDateToInputFormat = (dateString: string | null): string => {
    if (!dateString) return "";
    // Convert from "DD.MM.YYYY" to "YYYY-MM-DD"
    const parts = dateString.split(".");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return "";
  };

  const formatCurrency = (value: string): string => {
    if (!value) return "";
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const handleIsinChange = (value: string) => {
    const selectedBond = bonds.find((bond) => bond["ISIN / ISIN RegS"] === value);
    const maturityDate = selectedBond?.["Maturity date"] 
      ? convertDateToInputFormat(selectedBond["Maturity date"])
      : "";
    const issueAmount = selectedBond?.["Issue amount"] 
      ? selectedBond["Issue amount"].toString()
      : "";
    
    setFormData({ 
      ...formData, 
      isin: value,
      maturity: maturityDate,
      notionalAmount: issueAmount
    });
  };

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
            <Logo className="size-8" />
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
                  <Label htmlFor="rfbId">RFB Identifier</Label>
                  <div className="flex gap-2">
                    <Input
                      id="rfbId"
                      placeholder="e.g., RFB-2025-ABC1234"
                      value={generateRfbId() || ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isin">ISIN Code</Label>
                <Select 
                  value={formData.isin} 
                  onValueChange={handleIsinChange}
                  required
                >
                  <SelectTrigger id="isin">
                    <SelectValue placeholder="Select ISIN code" />
                  </SelectTrigger>
                  <SelectContent>
                    {bonds
                      .filter((bond) => bond["ISIN / ISIN RegS"])
                      .map((bond) => (
                        <SelectItem key={bond["ISIN / ISIN RegS"]} value={bond["ISIN / ISIN RegS"]}>
                          {bond["ISIN / ISIN RegS"]} - {bond["Full name of the issuer (eng)"]}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Select a bond from the list</p>
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
                    type="text"
                    placeholder="e.g., $1,000,000"
                    value={formatCurrency(formData.notionalAmount)}
                    onChange={(e) => setFormData({ ...formData, notionalAmount: e.target.value })}
                    required
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground">Automatically populated from selected bond</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maturity">Maturity Date</Label>
                  <Input
                    id="maturity"
                    type="date"
                    value={formData.maturity}
                    onChange={(e) => setFormData({ ...formData, maturity: e.target.value })}
                    required
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground">Automatically populated from selected bond</p>
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
