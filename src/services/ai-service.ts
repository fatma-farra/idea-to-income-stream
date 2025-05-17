
interface OpenAICompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export type ContentType = 'microcopy' | 'errors' | 'onboarding' | 'tooltips';

export async function generateAIContent(
  type: ContentType,
  prompt: string,
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  const contentTypePrompts = {
    microcopy: "You are an expert UX writer specializing in concise, user-friendly microcopy. Create clear button text, labels, or short interface copy that's engaging and aligns with best UX practices. Be direct and use active voice.",
    errors: "You are an expert UX writer specializing in friendly error messages. Create error messages that clearly explain what went wrong, why it happened, and how to fix it, without being technical or blaming the user.",
    onboarding: "You are an expert UX writer specializing in onboarding experiences. Create welcoming, clear, and concise onboarding text that orients new users and highlights key features without overwhelming them.",
    tooltips: "You are an expert UX writer specializing in tooltips and helper text. Create concise, helpful tooltips that provide just the right amount of context or instruction without stating the obvious."
  };
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: contentTypePrompts[type]
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate content');
    }

    const data = await response.json() as OpenAICompletionResponse;
    return data.choices[0]?.message.content || '';
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}
