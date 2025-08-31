import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Paperclip, Smile, Send, Mic } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-card border-t border-border">
      <div className="flex items-end gap-2">
        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 flex-shrink-0">
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-12 py-3 h-auto min-h-[44px] resize-none bg-chat-chat-input border-border rounded-full"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>
        
        {message.trim() ? (
          <Button
            onClick={handleSend}
            size="sm"
            className="h-10 w-10 p-0 flex-shrink-0 rounded-full bg-gradient-primary hover:opacity-90"
          >
            <Send className="h-5 w-5" />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 flex-shrink-0">
            <Mic className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}