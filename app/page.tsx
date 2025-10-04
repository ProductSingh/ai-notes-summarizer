'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader as Loader2, FileText, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { generateSummaryWithGemini } from '@/lib/gemini';
import { toast } from 'sonner';

export default function Home() {
  const [noteText, setNoteText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = async () => {
    if (!noteText.trim()) {
      toast.error('Please enter some text to summarize');
      return;
    }

    setIsLoading(true);
    setSummary('');

    try {
      // Use Gemini API to generate summary
      const generatedSummary = await generateSummaryWithGemini(noteText);
      setSummary(generatedSummary);

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from('summaries')
          .insert({
            original_text: noteText,
            summary: generatedSummary,
            user_id: user.id
          });

        if (error) throw error;

        toast.success('Summary generated and saved successfully!');
      } else {
        toast.success('Summary generated successfully!');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to generate summary: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">AI Notes Summarizer</h1>
          </div>
          <p className="text-lg text-slate-600">
            Transform your lengthy notes into concise summaries with AI
          </p>
          <div className="mt-6">
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                View Saved Summaries
              </Button>
            </Link>
          </div>
        </div>

        <Card className="shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl">Enter Your Notes</CardTitle>
            <CardDescription>
              Paste or type your notes below and click summarize to get an AI-powered summary
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Textarea
                placeholder="Enter your notes here... The more detailed, the better the summary!"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="min-h-[200px] text-base resize-none focus-visible:ring-blue-500"
                disabled={isLoading}
              />
              <p className="text-sm text-slate-500 mt-2">
                {noteText.split(/\s+/).filter(w => w.length > 0).length} words
              </p>
            </div>

            <Button
              onClick={generateSummary}
              disabled={isLoading || !noteText.trim()}
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating AI Summary...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Summarize with AI
                </>
              )}
            </Button>

            {summary && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">AI Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">{summary}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
