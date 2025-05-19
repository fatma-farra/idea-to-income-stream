
import React from 'react';
import ContentGenerator from './components/ContentGenerator';
import CreditSystem from './components/CreditSystem';
import { useState } from 'react';

function App() {
  const [credits, setCredits] = useState(10);

  const handleUseCredit = () => {
    if (credits > 0) {
      setCredits(credits - 1);
      return true;
    }
    return false;
  };

  const handleAddCredits = (amount) => {
    setCredits(credits + amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">UXWriter AI</h1>
          <p className="text-gray-600 mt-2">Create professional UX copy in seconds</p>
        </header>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ContentGenerator onUseCredit={handleUseCredit} />
          </div>
          <div>
            <CreditSystem credits={credits} onAddCredits={handleAddCredits} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
