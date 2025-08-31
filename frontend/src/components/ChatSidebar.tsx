import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Search, Plus, MoreVertical } from "lucide-react";
import { useState } from "react";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
  isGroup: boolean;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Team Alpha Pool",
    lastMessage: "Let's meet at 3 PM today",
    timestamp: "2:45 PM",
    unreadCount: 3,
    avatar: "TA",
    isOnline: true,
    isGroup: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    lastMessage: "Thanks for the help!",
    timestamp: "1:30 PM",
    unreadCount: 0,
    avatar: "SJ",
    isOnline: true,
    isGroup: false,
  },
  {
    id: "3",
    name: "Project Beta Pool",
    lastMessage: "New files uploaded",
    timestamp: "12:15 PM",
    unreadCount: 7,
    avatar: "PB",
    isOnline: false,
    isGroup: true,
  },
  {
    id: "4",
    name: "Mike Chen",
    lastMessage: "See you tomorrow",
    timestamp: "11:20 AM",
    unreadCount: 0,
    avatar: "MC",
    isOnline: false,
    isGroup: false,
  },
];

interface ChatSidebarProps {
  selectedChatId: string;
  onChatSelect: (chatId: string) => void;
}

export function ChatSidebar({ selectedChatId, onChatSelect }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-chat-sidebar border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">ChatPool</h1>
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                selectedChatId === chat.id ? "bg-accent" : ""
              }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`/placeholder-avatar-${chat.id}.jpg`} />
                  <AvatarFallback>{chat.avatar}</AvatarFallback>
                </Avatar>
                {chat.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-chat-online-indicator border-2 border-chat-sidebar rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium truncate">{chat.name}</h3>
                  <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>
              
              {chat.unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground h-5 min-w-[20px] text-xs rounded-full flex items-center justify-center">
                  {chat.unreadCount}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}