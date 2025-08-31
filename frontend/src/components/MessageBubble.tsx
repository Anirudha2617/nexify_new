import { cn } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Check, CheckCheck } from "lucide-react";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isSent: boolean;
  isRead?: boolean;
  sender?: {
    name: string;
    avatar: string;
  };
  isGroup?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex gap-2 mb-4",
        message.isSent ? "justify-end" : "justify-start"
      )}
    >
      {!message.isSent && message.isGroup && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={`/placeholder-avatar-${message.sender?.name}.jpg`} />
          <AvatarFallback className="text-xs">{message.sender?.avatar}</AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={cn(
          "max-w-[70%] min-w-[120px]",
          message.isSent ? "order-1" : "order-2"
        )}
      >
        {!message.isSent && message.isGroup && (
          <p className="text-xs text-muted-foreground mb-1 px-1">
            {message.sender?.name}
          </p>
        )}
        
        <div
          className={cn(
            "rounded-2xl px-4 py-2 relative shadow-sm",
            message.isSent
              ? "bg-chat-message-sent text-chat-message-sent-foreground rounded-br-sm"
              : "bg-chat-message-received text-chat-message-received-foreground rounded-bl-sm"
          )}
        >
          <p className="text-sm leading-relaxed mb-1">{message.content}</p>
          
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className={cn(
              "text-xs",
              message.isSent 
                ? "text-chat-message-sent-foreground/70" 
                : "text-muted-foreground"
            )}>
              {message.timestamp}
            </span>
            
            {message.isSent && (
              <div className="ml-1">
                {message.isRead ? (
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                ) : (
                  <Check className="h-3 w-3 text-chat-message-sent-foreground/70" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}