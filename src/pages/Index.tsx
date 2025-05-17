
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { FileText, MessageSquare, Layout, Lightbulb } from "lucide-react";
import ContentGenerator from '@/components/ContentGenerator';
import CreditSystem from '@/components/CreditSystem';

export default function Index() {
  const [credits, setCredits] = useState(5); // Start with 5 free credits

  const handleUseCredit = () => {
    if (credits > 0) {
      setCredits(prev => prev - 1);
      return true;
    }
    return false;
  };

  const handleAddCredits = (amount: number) => {
    setCredits(prev => prev + amount);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">UXWriter AI</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Generate user-friendly UX content, microcopy, and UI text with our AI assistant
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Content Generator</span>
                <Badge variant="outline" className="ml-2 py-1">
                  {credits} credits remaining
                </Badge>
              </CardTitle>
              <CardDescription>
                Select a content type and describe what you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentGenerator onUseCredit={handleUseCredit} />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-1/4">
          <CreditSystem credits={credits} onAddCredits={handleAddCredits} />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Latest Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <span className="text-sm">Error message optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Layout className="h-4 w-4 text-primary" />
                  <span className="text-sm">Button text suggestions</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="text-sm">Tooltip content generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm">Onboarding sequence text</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Why Choose UXWriter AI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User-Centered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our AI is trained on user-centered design principles to create content that resonates with users.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Time-Saving</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate weeks worth of UX content in minutes, not days.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Flexible</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use credits as you need them - no monthly commitment required.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
