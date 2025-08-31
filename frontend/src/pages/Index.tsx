import { useState } from "react";
import { ChatSidebar } from "../components/ChatSidebar";
import { ChatArea } from "../components/ChatArea";

const Index = () => {
  const [selectedChatId, setSelectedChatId] = useState("1");

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <ChatSidebar
          selectedChatId={selectedChatId}
          onChatSelect={setSelectedChatId}
        />
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1">
        <ChatArea chatId={selectedChatId} />
      </div>
    </div>
  );
};

export default Index;
