"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, RefreshCw, BookOpen, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { QuoteCard } from "@/components/QuoteCard";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [quotes, setQuotes] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuotes = async () => {
    if (!prompt.trim()) {
      toast.error("الرجاء إدخال موضوع أولاً!");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل في توليد المحتوى");
      }

      setQuotes(data.quotes);
      toast.success("تم توليد المحتوى بنجاح!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء توليد المحتوى";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-8 h-8 text-emerald-500" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 font-arabic">
              مولّد الحِكم والمواضيع
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-arabic">
            ولّد حكماً ومواضيع ملهمة بضغطة زر
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-arabic">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-6 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl">
          <div className="space-y-4">
            <Textarea
              placeholder="أدخل موضوعك أو فكرتك (مثال: 'النجاح'، 'الحياة'، 'السعادة')"
              className="min-h-[100px] text-lg text-right font-arabic resize-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              dir="rtl"
            />
            <div className="flex gap-2">
              <Button
                onClick={generateQuotes}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-6 text-lg font-arabic"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    جارِ التوليد...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    توليد المحتوى
                  </>
                )}
              </Button>
              {quotes.length > 0 && (
                <Button
                  onClick={generateQuotes}
                  disabled={isGenerating}
                  variant="outline"
                  className="py-6"
                >
                  <RefreshCw className={`h-5 w-5 ${isGenerating ? "animate-spin" : ""}`} />
                </Button>
              )}
            </div>
          </div>
        </Card>

        {quotes.length > 0 && (
          <div className="space-y-4">
            {quotes.map((quote, index) => (
              <QuoteCard key={index} quote={quote} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}