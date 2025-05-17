
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Pencil, MessageSquare, Layout, AlertTriangle, FileText } from "lucide-react";
import { generateAIContent, ContentType } from '@/services/ai-service';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ContentGeneratorProps {
  onUseCredit: () => boolean;
}

const ContentGenerator = ({ onUseCredit }: ContentGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [selectedTab, setSelectedTab] = useState<ContentType>('microcopy');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  
  const examples: Record<ContentType, string> = {
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

    const savedApiKey = localStorage.getItem('openai_api_key') || apiKey;
    
    if (!savedApiKey) {
      setShowApiKeyDialog(true);
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
    
    try {
      const content = await generateAIContent(selectedTab, prompt, savedApiKey);
      setGeneratedContent(content);
      toast({
        title: "Content generated",
        description: "Your UX content has been created successfully!",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "There was an error generating your content. Please try again.",
        variant: "destructive",
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (value: string) => {
    setSelectedTab(value as ContentType);
    setPrompt(examples[value as ContentType]);
    setGeneratedContent('');
  };

  const handleSaveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('openai_api_key', apiKey);
      setShowApiKeyDialog(false);
      toast({
        title: "API Key saved",
        description: "Your API key has been saved for future use.",
      });
      handleGenerate();
    }
  };

  return (
    <div>
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OpenAI API Key</DialogTitle>
            <DialogDescription>
              We need your OpenAI API key to generate content. This will be stored locally and not sent to our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input 
              id="apiKey" 
              type="password" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
              placeholder="sk-..." 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Your API key is stored only in your browser's local storage.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowApiKeyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveApiKey}>Save & Generate</Button>
          </div>
        </DialogContent>
      </Dialog>

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
