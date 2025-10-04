// Gemini API utility for generating summaries
export async function generateSummaryWithGemini(text: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_GEMINI_URL;

  console.log('Gemini API Key exists:', !!apiKey);
  console.log('Gemini API URL exists:', !!apiUrl);
  console.log('API URL:', apiUrl);

  if (!apiKey || !apiUrl) {
    throw new Error('Gemini API key or URL not configured. Please check your environment variables.');
  }

  const prompt = `Please provide a concise summary of the following text. Keep it clear, well-structured, and capture the main points:

${text}

Summary:`;

  try {
    console.log('Making request to Gemini API...');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}. Details: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text.trim();
    } else {
      console.error('Unexpected response format:', data);
      throw new Error('Invalid response format from Gemini API. Check console for details.');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
    throw new Error('Failed to generate summary with Gemini API');
  }
}
