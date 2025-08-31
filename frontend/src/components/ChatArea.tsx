import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { useState, useEffect, useRef } from "react";

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

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      content: "Hey everyone! How's the project coming along?",
      timestamp: "10:30 AM",
      isSent: false,
      sender: { name: "Alice Cooper", avatar: "AC" },
      isGroup: true,
    },
    {
      id: "2",
      content: "Looking great! We're almost done with the frontend.",
      timestamp: "10:32 AM",
      isSent: true,
      isRead: true,
    },
    {
      id: "3",
      content: "Perfect! I'll start working on the backend integration.",
      timestamp: "10:35 AM",
      isSent: false,
      sender: { name: "Bob Wilson", avatar: "BW" },
      isGroup: true,
    },
    {
      id: "4",
      content: "Let's meet at 3 PM today to discuss the final details",
      timestamp: "2:45 PM",
      isSent: false,
      sender: { name: "Alice Cooper", avatar: "AC" },
      isGroup: true,
    },
  ],
  "2": [
    {
      id: "1",
      content: "Hi! How are you doing?",
      timestamp: "1:20 PM",
      isSent: false,
    },
    {
      id: "2",
      content: "I'm doing great! Thanks for asking. How about you?",
      timestamp: "1:22 PM",
      isSent: true,
      isRead: true,
    },
    {
      id: "3",
      content: "Thanks for the help with the project yesterday!",
      timestamp: "1:30 PM",
      isSent: false,
    },
    {
      id: "4",
      content: "You're welcome! Happy to help anytime 😊",
      timestamp: "1:31 PM",
      isSent: true,
      isRead: false,
    },
  ],
  "3": [
    {
      id: "1",
      content: "New files have been uploaded to the repository",
      timestamp: "12:15 PM",
      isSent: false,
      sender: { name: "System", avatar: "SY" },
      isGroup: true,
    },
  ],
  "4": [
    {
      id: "1",
      content: "Hey Mike! Are we still on for tomorrow?",
      timestamp: "11:15 AM",
      isSent: true,
      isRead: true,
    },
    {
      id: "2",
      content: "Yes! See you tomorrow at 10 AM",
      timestamp: "11:20 AM",
      isSent: false,
    },
  ],
};

interface ChatAreaProps {
  chatId: string;
}

export function ChatArea({ chatId }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(mockMessages[chatId] || []);
  }, [chatId]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      isRead: false,
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const isGroupChat = ["1", "3"].includes(chatId);

  return (
    <div className="h-full flex flex-col bg-gradient-chat">
      <ChatHeader chatId={chatId} />
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={{
                ...message,
                isGroup: isGroupChat && !message.isSent,
              }}
            />
          ))}
        </div>
      </ScrollArea>
      
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}