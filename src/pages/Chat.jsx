import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatRooms } from "@/hooks/useChatRooms";
import { ArrowLeft, Search } from "lucide-react";

export default function ChatPage() {
  const location = useLocation();
  const { rooms, isLoading, error, reload } = useChatRooms();
  const roomAlert = location.state?.roomAlert || "";

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
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

      <ScrollArea className="min-h-0 flex-1">
        {roomAlert && (
          <div className="mx-4 mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {roomAlert}
          </div>
        )}
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
          <div className="divide-y divide-border/40 pb-24">
            {rooms.map((conversation) => (
              <Link
                key={conversation.id}
                to={`/chat/${encodeURIComponent(conversation.id)}`}
                state={{ room: conversation, yourChatRef: conversation.yourChatRef }}
                className="flex w-full items-center gap-3 px-4 py-4 transition-colors hover:bg-secondary/50 active:bg-secondary"
              >
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  {conversation.profilePicture && (
                    <AvatarImage
                      src={conversation.profilePicture}
                      alt={conversation.therapistName}
                    />
                  )}
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
              </Link>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
