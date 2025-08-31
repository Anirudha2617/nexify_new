import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Phone, Video, MoreVertical, Search } from "lucide-react";

interface ChatHeaderProps {
  chatId: string;
}

export function ChatHeader({ chatId }: ChatHeaderProps) {
  // Mock data based on chatId
  const getChatInfo = (id: string) => {
    const chats = {
      "1": {
        name: "Team Alpha Pool",
        subtitle: "8 members",
        avatar: "TA",
        isOnline: true,
        isGroup: true,
      },
      "2": {
        name: "Sarah Johnson",
        subtitle: "Online",
        avatar: "SJ",
        isOnline: true,
        isGroup: false,
      },
      "3": {
        name: "Project Beta Pool",
        subtitle: "12 members",
        avatar: "PB",
        isOnline: false,
        isGroup: true,
      },
      "4": {
        name: "Mike Chen",
        subtitle: "Last seen 2h ago",
        avatar: "MC",
        isOnline: false,
        isGroup: false,
      },
    };
    return chats[id as keyof typeof chats] || chats["1"];
  };

  const chatInfo = getChatInfo(chatId);

  return (
    <div className="h-16 bg-card border-b border-border px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`/placeholder-avatar-${chatId}.jpg`} />
            <AvatarFallback>{chatInfo.avatar}</AvatarFallback>
          </Avatar>
          {chatInfo.isOnline && !chatInfo.isGroup && (
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-chat-online-indicator border-2 border-card rounded-full"></div>
          )}
        </div>
        
        <div>
          <h2 className="font-semibold">{chatInfo.name}</h2>
          <p className="text-sm text-muted-foreground">{chatInfo.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}