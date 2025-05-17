
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Pencil, MessageSquare, Layout, AlertTriangle, FileText } from "lucide-react";

interface ContentGeneratorProps {
  onUseCredit: () => boolean;
}

const ContentGenerator = ({ onUseCredit }: ContentGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [selectedTab, setSelectedTab] = useState('microcopy');
  
  const examples: Record<string, string> = {
    'microcopy': 'Create clear and concise button text for a checkout process',
    'errors': 'Write a friendly error message for a failed payment',
    'onboarding': 'Create welcome message text for new app users',
    'tooltips': 'Write tooltip text explaining how to use the filter function'
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please provide a description of the content you need.",
        variant: "destructive",
      });
      return;
    }

    const hasCredits = onUseCredit();
    if (!hasCredits) {
      toast({
        title: "No credits remaining",
        description: "Please purchase more credits to continue generating content.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    // In a real implementation, this would call an API
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response - in a real app this would be the AI's output
      const mockResponses: Record<string, string> = {
        'microcopy': "Complete Purchase → \nSave and Continue → \nAdd to Cart → \nCheck Out Now →",
        'errors': "We couldn't process your payment. Your card might have insufficient funds, or you may have entered incorrect details. Please try a different payment method or contact your bank.",
        'onboarding': "Welcome to the app! 👋\nLet's set up your workspace in just 3 simple steps so you can start creating amazing content right away.",
        'tooltips': "Filter Results: Narrow down items by selecting one or more categories, price ranges, or attributes to find exactly what you're looking for."
      };
      
      setGeneratedContent(mockResponses[selectedTab]);
      toast({
        title: "Content generated",
        description: "Your UX content has been created successfully!",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setPrompt(examples[value]);
    setGeneratedContent('');
  };

  return (
    <div>
      <Tabs defaultValue="microcopy" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="microcopy" className="flex gap-2 items-center">
            <Pencil className="h-4 w-4" /> Microcopy
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex gap-2 items-center">
            <AlertTriangle className="h-4 w-4" /> Error Messages
          </TabsTrigger>
          <TabsTrigger value="onboarding" className="flex gap-2 items-center">
            <FileText className="h-4 w-4" /> Onboarding
          </TabsTrigger>
          <TabsTrigger value="tooltips" className="flex gap-2 items-center">
            <MessageSquare className="h-4 w-4" /> Tooltips
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <Label htmlFor="prompt">Describe what you need</Label>
          <Textarea 
            id="prompt"
            placeholder="E.g., Create button text for a checkout form..."
            className="mt-2 h-24"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <Button 
            onClick={handleGenerate} 
            className="mt-4 w-full"
            disabled={loading || !prompt.trim()}
          >
            {loading ? "Generating..." : "Generate Content (1 Credit)"}
          </Button>
        </div>
        
        {generatedContent && (
          <div className="mt-6">
            <Label htmlFor="result">Generated Content</Label>
            <div className="mt-2 p-4 border rounded-md bg-muted/30">
              <div className="whitespace-pre-wrap">{generatedContent}</div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(generatedContent)}>
                Copy to Clipboard
              </Button>
              <Button variant="outline" onClick={() => setGeneratedContent('')}>
                Clear
              </Button>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default ContentGenerator;
