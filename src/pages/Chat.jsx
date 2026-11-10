import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChatRooms } from "@/hooks/useChatRooms";
import {
  ArrowLeft,
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
} from "lucide-react";

export default function ChatPage() {
  const { rooms, isLoading, error, reload } = useChatRooms();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const currentConversation = rooms.find((room) => room.id === selectedChat);

  const handleSelectConversation = (conversationId) => {
    setSelectedChat(conversationId);
    setMessages([]);
    setInputMessage("");
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        text: inputMessage,
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
    }
  };

  if (selectedChat === null) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-lg">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                asChild
              >
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-lg font-bold">Chat</h1>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <p className="px-4 py-12 text-center text-sm text-muted-foreground">
              Memuat chat...
            </p>
          ) : error ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                type="button"
                variant="outline"
                className="mt-4 rounded-full"
                onClick={reload}
              >
                Coba lagi
              </Button>
            </div>
          ) : rooms.length === 0 ? (
            <p className="px-4 py-12 text-center text-sm text-muted-foreground">
              Belum ada chat
            </p>
          ) : (
            <div className="divide-y divide-border/40">
              {rooms.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className="flex w-full items-center gap-3 px-4 py-4 transition-colors hover:bg-secondary/50 active:bg-secondary"
                >
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary text-sm font-bold text-foreground">
                      {conversation.therapistInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="truncate text-sm font-bold">
                        {conversation.therapistName}
                      </h3>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {conversation.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-foreground">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setSelectedChat(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary text-sm font-bold text-foreground">
                {currentConversation?.therapistInitial}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-bold">
                {currentConversation?.therapistName}
              </h3>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Online
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1 bg-muted/40">
        <div className="space-y-4 px-4 py-6 pb-24">
          {messages.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Belum ada pesan
            </p>
          ) : (
            messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                  message.sender === "user"
                    ? "rounded-br-md bg-primary text-foreground"
                    : "rounded-bl-md bg-card"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p
                  className={`mt-1 text-xs ${
                    message.sender === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.time}
                </p>
              </div>
            </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="fixed bottom-20 left-1/2 w-full max-w-[450px] -translate-x-1/2 border-t border-border/40 bg-card/95 p-4 backdrop-blur-lg">
        <div className="flex gap-2">
          <Input
            placeholder="Ketik pesan..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="h-12 flex-1 rounded-full border-border bg-secondary/50 px-6"
          />
          <Button
            size="icon"
            className="h-12 w-12 flex-shrink-0 rounded-full bg-primary text-foreground shadow-lg hover:shadow-xl"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
