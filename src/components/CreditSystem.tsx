
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface CreditSystemProps {
  credits: number;
  onAddCredits: (amount: number) => void;
}

interface CreditPlan {
  id: number;
  amount: number;
  price: number;
  popular?: boolean;
  savings?: string;
}

const CreditSystem = ({ credits, onAddCredits }: CreditSystemProps) => {
  const [selectedPlan, setSelectedPlan] = useState<CreditPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const creditPlans: CreditPlan[] = [
    { id: 1, amount: 10, price: 5 },
    { id: 2, amount: 50, price: 20, popular: true, savings: '20% off' },
    { id: 3, amount: 100, price: 35, savings: '30% off' },
  ];
  
  const handlePurchase = () => {
    if (selectedPlan) {
      // In a real app, this would process payment
      setTimeout(() => {
        onAddCredits(selectedPlan.amount);
        toast({
          title: "Credits purchased",
          description: `${selectedPlan.amount} credits have been added to your account.`,
        });
        setIsDialogOpen(false);
        setSelectedPlan(null);
      }, 1000);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Credits</CardTitle>
        <CardDescription>Buy credits to generate more content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-4xl font-bold">{credits}</div>
          <p className="text-muted-foreground mt-1">credits remaining</p>
        </div>
        
        <Button 
          className="w-full mt-4" 
          onClick={() => setIsDialogOpen(true)}
        >
          Buy More Credits
        </Button>
      </CardContent>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buy Credits</DialogTitle>
            <DialogDescription>
              Choose a credit package that works for your needs.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {creditPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`
                  p-4 rounded-lg border-2 cursor-pointer relative 
                  ${selectedPlan?.id === plan.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'}
                `}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 -right-2 bg-primary text-primary-foreground text-xs py-1 px-2 rounded-full">
                    Popular
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{plan.amount} Credits</h3>
                    {plan.savings && (
                      <span className="text-xs text-emerald-600 font-medium">
                        {plan.savings}
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-bold">
                    ${plan.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handlePurchase} 
              disabled={!selectedPlan}
            >
              Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CreditSystem;
