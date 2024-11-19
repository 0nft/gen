import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface QuoteCardProps {
  quote: string;
}

export function QuoteCard({ quote }: QuoteCardProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("تم النسخ بنجاح!");
  };

  return (
    <Card className="p-4 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start gap-4">
        <p className="text-lg flex-1 text-right font-arabic">{quote}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => copyToClipboard(quote)}
          className="shrink-0"
        >
          <Copy className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}